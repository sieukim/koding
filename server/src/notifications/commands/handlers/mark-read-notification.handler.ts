import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { MarkReadNotificationCommand } from "../mark-read-notification.command";
import { NotificationsRepository } from "../../notifications.repository";

@CommandHandler(MarkReadNotificationCommand)
export class MarkReadNotificationHandler
  implements ICommandHandler<MarkReadNotificationCommand>
{
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  async execute(command: MarkReadNotificationCommand): Promise<void> {
    const { notificationId, nickname } = command;
    await this.notificationsRepository.updateOne(
      {
        notificationId: { eq: notificationId },
        receiverNickname: { eq: nickname },
      },
      {
        read: true,
      },
    );
    return;
  }
}
