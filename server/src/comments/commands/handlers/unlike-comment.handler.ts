import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { UnlikeCommentCommand } from "../unlike-comment.command";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { CommentLike } from "../../../entities/comment-like.entity";
import { getCurrentDate, isSameDate } from "../../../common/utils/time.util";
import { CommentUnlikedEvent } from "../../events/comment-unliked.event";
import { increaseField } from "../../../common/utils/increase-field";
import { Comment } from "../../../entities/comment.entity";

@CommandHandler(UnlikeCommentCommand)
export class UnlikeCommentHandler
  implements ICommandHandler<UnlikeCommentCommand>
{
  constructor(private readonly eventBus: EventBus) {}

  @Transaction()
  async execute(
    command: UnlikeCommentCommand,
    @TransactionManager() tm?: EntityManager,
  ) {
    const em = tm!;
    const {
      commentId,
      nickname,
      postIdentifier: { postId, boardType },
    } = command;
    const commentLike = await em.findOne(CommentLike, {
      where: { commentId, nickname },
    });
    if (commentLike) {
      await em.remove(commentLike);
      if (isSameDate(getCurrentDate(), commentLike.createdAt))
        await increaseField(em, Comment, "likeCount", -1, { commentId });
      this.eventBus.publish(
        new CommentUnlikedEvent(commentId, nickname, commentLike.createdAt),
      );
    }
    return;
  }
}
