import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteOrphanCommentLikesCommand } from "../delete-orphan-comment-likes.command";
import { CommentLikeService } from "../../services/comment-like.service";

@CommandHandler(DeleteOrphanCommentLikesCommand)
export class DeleteOrphanCommentLikesHandler
  implements ICommandHandler<DeleteOrphanCommentLikesCommand>
{
  constructor(private readonly commentLikeService: CommentLikeService) {}

  async execute(command: DeleteOrphanCommentLikesCommand) {
    const { commentId } = command;
    await this.commentLikeService.removeOrphanCommentLikes(commentId);
    return;
  }
}
