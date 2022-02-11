import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UnlikeCommentCommand } from "../unlike-comment.command";
import { CommentLikeService } from "../../services/comment-like.service";

@CommandHandler(UnlikeCommentCommand)
export class UnlikeCommentHandler
  implements ICommandHandler<UnlikeCommentCommand>
{
  constructor(private readonly commentLikeService: CommentLikeService) {}

  async execute(command: UnlikeCommentCommand) {
    const { commentId, nickname, postIdentifier } = command;
    await this.commentLikeService.unlikeComment(
      postIdentifier,
      commentId,
      nickname,
    );
    return;
  }
}
