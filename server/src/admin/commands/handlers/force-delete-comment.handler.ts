import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { ForceDeleteCommentCommand } from "../force-delete-comment.command";
import { CommentDeletedByAdminEvent } from "../../events/comment-deleted-by-admin.event";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { Comment } from "../../../entities/comment.entity";
import { orThrowNotFoundComment } from "../../../common/utils/or-throw";

@CommandHandler(ForceDeleteCommentCommand)
export class ForceDeleteCommentHandler
  implements ICommandHandler<ForceDeleteCommentCommand>
{
  constructor(private readonly eventBus: EventBus) {}

  @Transaction()
  async execute(
    command: ForceDeleteCommentCommand,
    @TransactionManager() tm?: EntityManager,
  ): Promise<void> {
    const em = tm!;
    const { postIdentifier, commentId } = command;
    const comment = await em
      .findOneOrFail(Comment, {
        where: { commentId },
      })
      .catch(orThrowNotFoundComment);
    comment.verifyOwnerPost(postIdentifier);
    await em.remove(comment);
    if (comment.writerNickname)
      this.eventBus.publish(new CommentDeletedByAdminEvent(comment));
  }
}
