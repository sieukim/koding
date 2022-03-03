import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetWritingCommentsQuery } from "../get-writing-comments.query";
import { Comment } from "../../../entities/comment.entity";
import { WritingCommentsInfoDto } from "../../dto/writing-comments-info.dto";
import { EntityManager, Transaction, TransactionManager } from "typeorm";

@QueryHandler(GetWritingCommentsQuery)
export class GetWritingCommentsHandler
  implements IQueryHandler<GetWritingCommentsQuery, WritingCommentsInfoDto>
{
  @Transaction()
  async execute(
    query: GetWritingCommentsQuery,
    @TransactionManager() tm?: EntityManager,
  ): Promise<WritingCommentsInfoDto> {
    const em = tm!;
    const { nickname, pageSize, cursor, boardType } = query;
    const qb = em
      .createQueryBuilder(Comment, "comment")
      .where("comment.writerNickname = :nickname", { nickname })
      .andWhere("(comment.boardType = :boardType)", { boardType })
      .innerJoinAndSelect("comment.post", "post")
      .orderBy("comment.createdAt", "DESC")
      .addOrderBy("comment.commentId", "DESC")
      .limit(pageSize + 1);
    if (cursor) {
      const [createdAt, commentId] = cursor?.split(",");
      qb.andWhere(
        "(comment.createdAt < :createdAt OR (comment.createdAt = :createdAt AND comment.commentId < :commentId))",
        {
          createdAt: new Date(parseInt(createdAt)),
          commentId,
        },
      );
    }
    const comments = await qb.getMany();
    let nextPageCursor: string | undefined;
    if (comments.length === pageSize + 1) {
      const { createdAt, commentId } = comments.pop()!;
      nextPageCursor = [createdAt.getTime().toString(), commentId].join(",");
    }
    return new WritingCommentsInfoDto(comments, nextPageCursor);
  }
}
