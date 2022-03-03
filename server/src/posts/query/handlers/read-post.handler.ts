import { EventPublisher, IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ReadPostQuery } from "../read-post.query";
import { PostWithAroundInfoDto } from "../../dto/post-with-around-info.dto";
import { CACHE_MANAGER, Inject } from "@nestjs/common";
import { Post, PostIdentifier } from "../../../entities/post.entity";
import { Cache } from "cache-manager";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { orThrowNotFoundPost } from "../../../common/utils/or-throw";
import { Fetched } from "../../../common/types/fetched.type";

@QueryHandler(ReadPostQuery)
export class ReadPostHandler implements IQueryHandler<ReadPostQuery> {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly publisher: EventPublisher,
  ) {}

  @Transaction()
  async execute(
    query: ReadPostQuery,
    @TransactionManager() tm?: EntityManager,
  ): Promise<PostWithAroundInfoDto> {
    const em = tm!;
    const { postIdentifier, readerNickname, readerIp } = query;
    const { postId, boardType } = postIdentifier;
    const qb = em
      .createQueryBuilder(Post, "post")
      .where("(post.postId = :postId AND post.boardType = :boardType)", {
        boardType,
        postId,
      })
      .leftJoinAndSelect("post.writer", "writer");

    if (readerNickname) {
      qb.leftJoinAndSelect("post.likes", "like", "like.nickname = :nickname")
        .leftJoinAndSelect(
          "post.reports",
          "report",
          "report.nickname = :nickname",
        )
        .leftJoinAndSelect("post.scraps", "scrap", "scrap.nickname = :nickname")
        .setParameters({
          nickname: readerNickname,
        });
    }
    const post = this.publisher.mergeObjectContext(
      (await qb.getOneOrFail().catch(orThrowNotFoundPost)) as Fetched<
        Post,
        "writer"
      >,
    );
    console.log("post read: ", post);
    if (await this.shouldIncreaseReadCount(postIdentifier, readerIp))
      post.increaseReadCount();
    const [prevPost, nextPost] = await Promise.all([
      em
        .createQueryBuilder(Post, "post")
        .where("post.boardType = :boardType", { boardType })
        .andWhere(
          "(post.createdAt > :createdAt OR (post.createdAt = :createdAt AND post.postId > :postId))",
          {
            createdAt: post.createdAt,
            postId,
          },
        )
        .orderBy("post.createdAt", "ASC")
        .addOrderBy("post.postId", "ASC")
        .getOne(),
      em
        .createQueryBuilder(Post, "post")
        .where("post.boardType = :boardType", { boardType })
        .andWhere(
          "(post.createdAt < :createdAt OR (post.createdAt = :createdAt AND post.postId < :postId))",
          {
            createdAt: post.createdAt,
            postId,
          },
        )
        .orderBy("post.createdAt", "DESC")
        .addOrderBy("post.postId", "DESC")
        .getOne(),
    ]);

    const [liked, scrapped, reported] = [
      (post.likes?.length ?? 0) > 0,
      (post.scraps?.length ?? 0) > 0,
      (post.reports?.length ?? 0) > 0,
    ];
    post.commit();
    return new PostWithAroundInfoDto(
      post,
      liked,
      scrapped,
      reported,
      prevPost,
      nextPost,
    );
  }

  private async shouldIncreaseReadCount(
    postIdentifier: PostIdentifier,
    ip: string,
  ) {
    const key = postIdentifier.postId + "/" + ip;
    const isUserReadPost = (await this.cacheManager.get(key)) ?? false;
    console.log(`isUserReadPost: ${isUserReadPost}, ${key}`);
    if (isUserReadPost) {
      return false;
    } else {
      // 읽음 표시
      await this.cacheManager.set(key, true, { ttl: 24 * 60 * 60 }); // 하루
      return true;
    }
  }
}
