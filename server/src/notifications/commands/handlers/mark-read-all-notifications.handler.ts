import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { MarkReadAllNotificationsCommand } from "../mark-read-all-notifications.command";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { Notification } from "../../../entities/notification.entity";

@CommandHandler(MarkReadAllNotificationsCommand)
export class MarkReadAllNotificationsHandler
  implements ICommandHandler<MarkReadAllNotificationsCommand>
{
  @Transaction()
  async execute(
    command: MarkReadAllNotificationsCommand,
    @TransactionManager() tm?: EntityManager,
  ) {
    const em = tm!;
    const { nickname } = command;
    await em.update(
      Notification,
      {
        receiverNickname: nickname,
        read: false,
      },
      { read: true },
    );
  }
}
