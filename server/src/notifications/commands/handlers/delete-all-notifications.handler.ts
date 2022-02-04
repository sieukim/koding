import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteAllNotificationsCommand } from "../delete-all-notifications.command";
import { NotificationsRepository } from "../../notifications.repository";

@CommandHandler(DeleteAllNotificationsCommand)
export class DeleteAllNotificationsHandler
  implements ICommandHandler<DeleteAllNotificationsCommand>
{
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  async execute(command: DeleteAllNotificationsCommand): Promise<number> {
    const { nickname } = command;
    return this.notificationsRepository.deleteAll({
      receiverNickname: { eq: nickname },
    });
  }
}
