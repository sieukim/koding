import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { IncreaseCommentCountCommand } from "../increase-comment-count.command";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { Post } from "../../../entities/post.entity";
import { increaseField } from "../../../common/utils/increase-field";

@CommandHandler(IncreaseCommentCountCommand)
export class IncreaseCommentCountHandler
  implements ICommandHandler<IncreaseCommentCountCommand>
{
  @Transaction()
  async execute(
    command: IncreaseCommentCountCommand,
    @TransactionManager() tm?: EntityManager,
  ) {
    const em = tm!;
    const {
      postIdentifier: { postId, boardType },
      type,
    } = command;
    await increaseField(em, Post, "commentCount", type, { postId, boardType });
  }
}
