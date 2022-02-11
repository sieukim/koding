import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LikeCommentCommand } from "../like-comment.command";
import { CommentLikeService } from "../../services/comment-like.service";

@CommandHandler(LikeCommentCommand)
export class LikeCommentHandler implements ICommandHandler<LikeCommentCommand> {
  constructor(private readonly commentLikeService: CommentLikeService) {}

  async execute(command: LikeCommentCommand) {
    const { commentId, postIdentifier, nickname } = command;
    await this.commentLikeService.likeComment(
      postIdentifier,
      commentId,
      nickname,
    );
    return;
  }
}
