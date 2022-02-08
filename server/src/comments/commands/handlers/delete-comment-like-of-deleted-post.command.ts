import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteCommentLikeOfDeletedPostCommand } from "../delete-comment-like-of-deleted-post.command";
import { CommentLikeService } from "../../services/comment-like.service";

@CommandHandler(DeleteCommentLikeOfDeletedPostCommand)
export class DeleteCommentLikeOfDeletedPostHandler
  implements ICommandHandler<DeleteCommentLikeOfDeletedPostCommand>
{
  constructor(private readonly commentLikeService: CommentLikeService) {}

  async execute(command: DeleteCommentLikeOfDeletedPostCommand) {
    const { postIdentifier } = command;
    await this.commentLikeService.removeOrphanCommentLikes(postIdentifier);
    return;
  }
}
