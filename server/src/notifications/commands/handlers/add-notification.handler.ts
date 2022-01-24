import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AddNotificationCommand } from "../add-notification.command";
import { NotificationsRepository } from "../../notifications.repository";
import { Notification } from "../../../models/notification.model";

@CommandHandler(AddNotificationCommand)
export class AddNotificationHandler
  implements ICommandHandler<AddNotificationCommand, Notification>
{
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  async execute(command: AddNotificationCommand): Promise<Notification> {
    const { data, receiverNickname } = command;
    const notification = new Notification({ data, receiverNickname });
    return await this.notificationsRepository.persist(notification);
  }
}
