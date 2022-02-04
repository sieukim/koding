import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { MarkReadAllNotificationsCommand } from "../mark-read-all-notifications.command";
import { NotificationsRepository } from "../../notifications.repository";

@CommandHandler(MarkReadAllNotificationsCommand)
export class MarkReadAllNotificationsHandler
  implements ICommandHandler<MarkReadAllNotificationsCommand>
{
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  async execute(command: MarkReadAllNotificationsCommand): Promise<void> {
    const { nickname } = command;
    await this.notificationsRepository.updateAll(
      {
        receiverNickname: { eq: nickname },
        read: { eq: false },
      },
      {
        read: true,
      },
    );
    return;
  }
}
