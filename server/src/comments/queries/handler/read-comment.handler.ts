import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ReadCommentQuery } from "../read-comment.query";
import { PostsRepository } from "../../../posts/posts.repository";
import { CommentsRepository } from "../../comments.repository";
import { ReadCommentDto } from "../../dto/read-comment.dto";
import { SortType } from "../../../common/repository/sort-option";
import { Logger, NotFoundException } from "@nestjs/common";

@QueryHandler(ReadCommentQuery)
export class ReadCommentHandler
  implements IQueryHandler<ReadCommentQuery, ReadCommentDto>
{
  private readonly logger = new Logger(ReadCommentHandler.name);

  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly commentsRepository: CommentsRepository,
  ) {}

  async execute(query: ReadCommentQuery): Promise<ReadCommentDto> {
    const { postIdentifier } = query;
    const [post, comments] = await Promise.all([
      this.postsRepository.findByPostId(postIdentifier),
      this.commentsRepository.findAll(
        { postId: { eq: postIdentifier.postId } },
        { commentId: SortType.ASC }, // 오래된 댓글 앞에, 최신 댓글 뒤에
      ),
    ]);
    if (!post) throw new NotFoundException("잘못된 게시글입니다");
    this.logger.log(`comments: ${comments}`);
    return new ReadCommentDto(comments);
  }
}
