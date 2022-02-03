import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetWritingCommentsQuery } from "../get-writing-comments.query";
import { CommentsRepository } from "../../../comments/comments.repository";
import { SortType } from "../../../common/repository/sort-option";
import { FindOption } from "../../../common/repository/find-option";
import { Comment } from "../../../models/comment.model";
import { WritingCommentsInfoDto } from "../../dto/writing-comments-info.dto";

@QueryHandler(GetWritingCommentsQuery)
export class GetWritingCommentsHandler
  implements IQueryHandler<GetWritingCommentsQuery, WritingCommentsInfoDto>
{
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async execute(
    query: GetWritingCommentsQuery,
  ): Promise<WritingCommentsInfoDto> {
    const { nickname, pageSize, cursor, boardType } = query;
    const findOption: FindOption<Comment> = {
      writerNickname: { eq: nickname },
      boardType: { eq: boardType },
    };
    if (cursor) findOption.commentId = { lte: cursor };
    const comments = await this.commentsRepository.findAll(
      findOption,
      { commentId: SortType.DESC },
      pageSize + 1,
    );
    let nextPageCursor: string | undefined;
    if (comments.length === pageSize + 1)
      nextPageCursor = comments.pop().commentId;
    return new WritingCommentsInfoDto(comments, nextPageCursor);
  }
}
