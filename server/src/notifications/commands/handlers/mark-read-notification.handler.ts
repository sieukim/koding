import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { MarkReadNotificationCommand } from "../mark-read-notification.command";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { Notification } from "../../../entities/notification.entity";

@CommandHandler(MarkReadNotificationCommand)
export class MarkReadNotificationHandler
  implements ICommandHandler<MarkReadNotificationCommand>
{
  @Transaction()
  async execute(
    command: MarkReadNotificationCommand,
    @TransactionManager() tm?: EntityManager,
  ) {
    const em = tm!;
    const { notificationId, nickname } = command;
    await em.update(
      Notification,
      { notificationId, receiverNickname: nickname },
      { read: true },
    );
  }
}
