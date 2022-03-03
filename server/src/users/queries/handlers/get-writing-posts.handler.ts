import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetWritingPostsQuery } from "../get-writing-posts.query";
import { Post } from "../../../entities/post.entity";
import { WritingPostsInfoDto } from "../../dto/writing-posts-info.dto";
import { EntityManager, Transaction, TransactionManager } from "typeorm";

@QueryHandler(GetWritingPostsQuery)
export class GetWritingPostsHandler
  implements IQueryHandler<GetWritingPostsQuery>
{
  @Transaction()
  async execute(
    query: GetWritingPostsQuery,
    @TransactionManager() tm?: EntityManager,
  ) {
    const em = tm!;
    const { nickname, boardType, pageSize, cursor } = query;
    const qb = em
      .createQueryBuilder(Post, "post")
      .where("post.writerNickname = :nickname", { nickname })
      .andWhere("(post.boardType = :boardType)", { boardType })
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
    const posts = await qb.getMany();
    let nextPageCursor: string | undefined;
    if (posts.length === pageSize) {
      const { createdAt, postId } = posts[pageSize - 1];
      nextPageCursor = [createdAt.getTime().toString(), postId].join(",");
    }
    return new WritingPostsInfoDto(posts, nextPageCursor);
  }
}
