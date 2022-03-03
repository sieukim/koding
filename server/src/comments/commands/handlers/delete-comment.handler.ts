import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { DeleteCommentCommand } from "../delete-comment.command";
import { CommentDeletedEvent } from "../../events/comment-deleted.event";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { Comment } from "../../../entities/comment.entity";
import { orThrowNotFoundComment } from "../../../common/utils/or-throw";

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentHandler
  implements ICommandHandler<DeleteCommentCommand>
{
  constructor(private readonly eventBus: EventBus) {}

  @Transaction()
  async execute(
    command: DeleteCommentCommand,
    @TransactionManager() tm?: EntityManager,
  ): Promise<void> {
    const em = tm!;
    const {
      commentId,
      postIdentifier: { postId, boardType },
      requestUserNickname,
    } = command;
    const comment = await em
      .findOneOrFail(Comment, {
        where: {
          commentId,
          boardType,
          postId,
        },
      })
      .catch(orThrowNotFoundComment);
    comment.verifyOwner(requestUserNickname);
    await em.remove(comment);
    this.eventBus.publish(
      new CommentDeletedEvent(
        { postId, boardType },
        comment.commentId,
        comment.createdAt,
      ),
    );
  }
}
