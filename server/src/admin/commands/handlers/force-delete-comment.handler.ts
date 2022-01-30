import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { ForceDeleteCommentCommand } from "../force-delete-comment.command";
import { CommentsRepository } from "../../../comments/comments.repository";
import { PostsRepository } from "../../../posts/posts.repository";
import { NotFoundException } from "@nestjs/common";
import { CommentDeletedByAdminEvent } from "../../events/comment-deleted-by-admin.event";

@CommandHandler(ForceDeleteCommentCommand)
export class ForceDeleteCommentHandler
  implements ICommandHandler<ForceDeleteCommentCommand>
{
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly postsRepository: PostsRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: ForceDeleteCommentCommand): Promise<void> {
    const { postIdentifier, commentId } = command;
    const [post, comment] = await Promise.all([
      this.postsRepository.findByPostId(postIdentifier),
      this.commentsRepository.findByCommentId(commentId),
    ]);
    if (!post || !comment) throw new NotFoundException("없는 댓글");
    await this.commentsRepository.remove(comment);
    if (comment.writerNickname)
      this.eventBus.publish(
        new CommentDeletedByAdminEvent(
          postIdentifier,
          commentId,
          comment.writerNickname,
        ),
      );
  }
}
