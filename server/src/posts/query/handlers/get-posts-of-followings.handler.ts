import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetPostsOfFollowingsQuery } from "../get-posts-of-followings.query";
import { Post } from "../../../entities/post.entity";
import { PostListWithCursorDto } from "../../dto/post-list-with-cursor.dto";
import { PostWithWriterInfoDto } from "../../dto/post-with-writer-info.dto";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { User } from "../../../entities/user.entity";
import { orThrowNotFoundUser } from "src/common/utils/or-throw";
import { Follow } from "../../../entities/follow.entity";
import { Logger } from "@nestjs/common";

@QueryHandler(GetPostsOfFollowingsQuery)
export class GetPostsOfFollowingsHandler
  implements IQueryHandler<GetPostsOfFollowingsQuery>
{
  private readonly logger = new Logger(GetPostsOfFollowingsHandler.name);

  @Transaction()
  async execute(
    query: GetPostsOfFollowingsQuery,
    @TransactionManager() tm?: EntityManager,
  ) {
    const em = tm!;
    const { nickname, pageSize, cursor } = query;
    await em
      .findOneOrFail(User, { where: { nickname }, select: ["nickname"] })
      .catch(orThrowNotFoundUser);

    let nextPageCursor: string | undefined;
    const totalCountPromise = em.count(Post, {
      where: { writerNickname: nickname },
    });

    const qb = em
      .createQueryBuilder(Post, "post")
      .innerJoinAndSelect("post.writer", "writer")
      .where(
        "post.writerNickname IN " +
          em
            .createQueryBuilder()
            .subQuery()
            .select("follow.toNickname")
            .from(Follow, "follow")
            .where("follow.fromNickname = :nickname")
            .getQuery(),
      )
      .setParameters({ nickname })
      .orderBy("post.createdAt", "DESC")
      .addOrderBy("post.postId", "DESC")
      .limit(pageSize);

    if (cursor) {
      const [createdAt, postId] = cursor.split(",");
      qb.andWhere(
        "(post.createdAt < :createdAt OR (post.createdAt = :createdAt AND post.postId < :postId))",
        {
          createdAt: new Date(parseInt(createdAt)),
          postId,
        },
      );
    }
    const [posts, totalCount] = await Promise.all([
      qb.getMany(),
      totalCountPromise,
    ]);
    if (posts.length === pageSize) {
      const { createdAt, postId } = posts[pageSize - 1];
      nextPageCursor = [createdAt, postId].join(",");
    }
    return new PostListWithCursorDto({
      posts: posts.map(PostWithWriterInfoDto.fromModel),
      nextPageCursor,
      totalCount,
    });
  }
}
