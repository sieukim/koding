import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { IncreaseReadCountCommand } from "../increase-read-count.command";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { Post } from "../../../entities/post.entity";
import { increaseField } from "../../../common/utils/increase-field";

@CommandHandler(IncreaseReadCountCommand)
export class IncreaseReadCountHandler
  implements ICommandHandler<IncreaseReadCountCommand>
{
  @Transaction()
  async execute(
    command: IncreaseReadCountCommand,
    @TransactionManager() tm?: EntityManager,
  ) {
    const em = tm!;
    const {
      postIdentifier: { postId, boardType },
    } = command;

    await increaseField(em, Post, "readCount", 1, { postId, boardType });
    return;
  }
}
