import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ModifyCommentCommand } from "../modify-comment.command";
import { Comment } from "../../../entities/comment.entity";
import { Logger } from "@nestjs/common";
import { EntityManager, In, Transaction, TransactionManager } from "typeorm";
import { orThrowNotFoundComment } from "../../../common/utils/or-throw";
import { User } from "../../../entities/user.entity";

@CommandHandler(ModifyCommentCommand)
export class ModifyCommentHandler
  implements ICommandHandler<ModifyCommentCommand>
{
  private readonly logger = new Logger(ModifyCommentHandler.name);

  @Transaction()
  async execute(
    command: ModifyCommentCommand,
    @TransactionManager() tm?: EntityManager,
  ): Promise<Comment> {
    const em = tm!;
    const {
      postIdentifier: { postId, boardType },
      requestUserNickname,
      modifyCommentRequest,
      commentId,
    } = command;

    const [comment, mentionedUser] = await Promise.all([
      em
        .findOneOrFail(Comment, { where: { commentId, postId, boardType } })
        .catch(orThrowNotFoundComment),
      em.find(User, {
        where: { nickname: In(modifyCommentRequest.mentionedNicknames ?? []) },
        select: ["nickname"],
      }),
    ]);
    this.logger.log(`comment: ${comment.toString}`);
    comment.modifyComment(requestUserNickname, {
      ...modifyCommentRequest,
      mentionedNicknames: mentionedUser.map(({ nickname }) => nickname),
    });
    await em.save(comment, { reload: false });
    return comment;
  }
}
