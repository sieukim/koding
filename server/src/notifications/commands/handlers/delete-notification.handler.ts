import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteNotificationCommand } from "../delete-notification.command";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { Notification } from "../../../entities/notification.entity";

@CommandHandler(DeleteNotificationCommand)
export class DeleteNotificationHandler
  implements ICommandHandler<DeleteNotificationCommand>
{
  @Transaction()
  async execute(
    command: DeleteNotificationCommand,
    @TransactionManager() tm?: EntityManager,
  ) {
    const em = tm!;
    const { notificationId, receiverNickname } = command;
    await em
      .createQueryBuilder()
      .delete()
      .from(Notification)
      .where(
        "notificationId = :notificationId AND receiverNickname = :receiverNickname",
        {
          notificationId,
          receiverNickname,
        },
      );
  }
}
