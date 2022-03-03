import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AddNotificationCommand } from "../add-notification.command";
import { Notification } from "../../../entities/notification.entity";
import { EntityManager, Transaction, TransactionManager } from "typeorm";

@CommandHandler(AddNotificationCommand)
export class AddNotificationHandler
  implements ICommandHandler<AddNotificationCommand, Notification>
{
  @Transaction()
  async execute(
    command: AddNotificationCommand,
    @TransactionManager() tm?: EntityManager,
  ): Promise<Notification> {
    const em = tm!;
    const { data, receiverNickname } = command;
    const notification = new Notification({ data, receiverNickname });
    await em.save(notification, { reload: false });
    return notification;
  }
}
