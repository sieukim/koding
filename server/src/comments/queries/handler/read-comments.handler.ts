import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ReadCommentsQuery } from "../read-comments.query";
import { PostsRepository } from "../../../posts/posts.repository";
import { CommentsRepository } from "../../comments.repository";
import { ReadCommentsDto } from "../../dto/read-comments.dto";
import { SortType } from "../../../common/repository/sort-option";
import { NotFoundException } from "@nestjs/common";
import { Comment } from "../../../models/comment.model";
import { CommentLikeService } from "../../services/comment-like.service";

@QueryHandler(ReadCommentsQuery)
export class ReadCommentsHandler
  implements IQueryHandler<ReadCommentsQuery, ReadCommentsDto>
{
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly commentsRepository: CommentsRepository,
    private readonly commentLikeService: CommentLikeService,
  ) {}

  async execute(query: ReadCommentsQuery): Promise<ReadCommentsDto> {
    const { postIdentifier, cursorCommentId, pageSize, readerNickname } = query;
    const post = await this.postsRepository.findByPostId(postIdentifier);
    if (!post) throw new NotFoundException("잘못된 게시글입니다");
    let comments: Comment[];
    let nextPageCursor: string | undefined;
    let prevPageCursor: string | undefined;
    if (!cursorCommentId) {
      comments = await this.commentsRepository.findAllWith(
        {
          postId: { eq: postIdentifier.postId },
        },
        ["writer"],
        {
          commentId: SortType.ASC,
        },
        pageSize + 1,
      );
    } else {
      comments = await this.commentsRepository.findAllWith(
        {
          postId: { eq: postIdentifier.postId },
          commentId: { gte: cursorCommentId },
        },
        ["writer"],
        {
          commentId: SortType.ASC,
        },
        pageSize + 1,
      );
      const prevComments = await this.commentsRepository.findAll(
        {
          postId: { eq: postIdentifier.postId },
          commentId: { lt: cursorCommentId },
        },
        { commentId: SortType.DESC },
        pageSize,
      );
      if (prevComments.length > 0) {
        prevPageCursor = prevComments[prevComments.length - 1].commentId;
      }
    }
    if (comments.length === pageSize + 1) {
      const nextCursorComment = comments.pop();
      nextPageCursor = nextCursorComment.commentId;
    }
    const userLikeComments = await this.commentLikeService.userLikeCommentsSet(
      comments.map(({ commentId }) => commentId),
      readerNickname,
    );
    return new ReadCommentsDto(
      comments.map((comment: Comment & { liked: boolean }) => {
        comment.liked = userLikeComments.has(comment.commentId);
        return comment;
      }),
      prevPageCursor,
      nextPageCursor,
    );
  }
}
