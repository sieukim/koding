import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetWritingCommentsQuery } from "../get-writing-comments.query";
import { CommentsRepository } from "../../../comments/comments.repository";
import { SortType } from "../../../common/repository/sort-option";
import { CommentInfoDto } from "../../../comments/dto/comment-info.dto";

@QueryHandler(GetWritingCommentsQuery)
export class GetWritingCommentsHandler
  implements IQueryHandler<GetWritingCommentsQuery, CommentInfoDto[]>
{
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async execute(query: GetWritingCommentsQuery): Promise<CommentInfoDto[]> {
    const { nickname } = query;
    const comments = await this.commentsRepository.findAll(
      { writerNickname: { eq: nickname } },
      { commentId: SortType.DESC },
    );

    return comments.map(CommentInfoDto.fromModel);
  }
}
