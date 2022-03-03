import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteAllNotificationsCommand } from "../delete-all-notifications.command";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { Notification } from "../../../entities/notification.entity";

@CommandHandler(DeleteAllNotificationsCommand)
export class DeleteAllNotificationsHandler
  implements ICommandHandler<DeleteAllNotificationsCommand>
{
  @Transaction()
  async execute(
    command: DeleteAllNotificationsCommand,
    @TransactionManager() tm?: EntityManager,
  ) {
    const em = tm!;
    const { nickname } = command;
    await em
      .createQueryBuilder()
      .delete()
      .from(Notification)
      .where("receiverNickname = :nickname", { nickname })
      .execute();
  }
}
