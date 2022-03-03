import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ReadCommentsQuery } from "../read-comments.query";
import { ReadCommentsDto } from "../../dto/read-comments.dto";
import { Comment } from "../../../entities/comment.entity";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { orThrowNotFoundPost } from "../../../common/utils/or-throw";
import { Post } from "../../../entities/post.entity";
import { Fetched } from "../../../common/types/fetched.type";

@QueryHandler(ReadCommentsQuery)
export class ReadCommentsHandler
  implements IQueryHandler<ReadCommentsQuery, ReadCommentsDto>
{
  @Transaction()
  async execute(
    query: ReadCommentsQuery,
    @TransactionManager() tm?: EntityManager,
  ): Promise<ReadCommentsDto> {
    const em = tm!;
    const {
      postIdentifier: { postId, boardType },
      cursorCommentId,
      pageSize,
      readerNickname,
    } = query;
    await em
      .findOneOrFail(Post, {
        where: { postId, boardType },
        select: ["postId"],
      })
      .catch(orThrowNotFoundPost);
    let nextPageCursor: string | undefined;
    const qb = em
      .createQueryBuilder(Comment, "comment")
      .leftJoinAndSelect("comment.writer", "writer")
      .where("comment.postId = :postId", { postId })
      .orderBy("comment.createdAt", "ASC")
      .addOrderBy("comment.commentId", "ASC")
      .limit(pageSize);

    if (cursorCommentId) {
      const [createdAt, commentId] = cursorCommentId.split(",");
      qb.andWhere(
        "(comment.createdAt > :createdAt OR (comment.createdAt = :createdAt AND comment.commentId > :commentId))",
        {
          createdAt: new Date(parseInt(createdAt)),
          commentId,
        },
      );
    }
    if (readerNickname)
      qb.leftJoinAndSelect(
        "comment.likes",
        "like",
        "like.nickname = :nickname",
        { nickname: readerNickname },
      );

    const comments = (await qb.getMany()) as Array<Fetched<Comment, "writer">>;
    if (comments.length === pageSize) {
      const { createdAt, commentId } = comments[pageSize - 1];
      nextPageCursor = [createdAt.getTime().toString(), commentId].join(",");
    }

    return new ReadCommentsDto(
      comments.map(
        (comment: Fetched<Comment, "writer"> & { liked: boolean }) => {
          comment.liked = (comment.likes?.length ?? 0) > 0;
          return comment;
        },
      ),
      nextPageCursor,
    );
  }
}
