import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteNotificationCommand } from "../delete-notification.command";
import { NotificationsRepository } from "../../notifications.repository";

@CommandHandler(DeleteNotificationCommand)
export class DeleteNotificationHandler
  implements ICommandHandler<DeleteNotificationCommand>
{
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  async execute(command: DeleteNotificationCommand): Promise<boolean> {
    const { notificationId, receiverNickname } = command;
    const notification = await this.notificationsRepository.findOne({
      notificationId: { eq: notificationId },
      receiverNickname: { eq: receiverNickname },
    });
    if (!notification) return false;
    return this.notificationsRepository.remove(notification);
  }
}
