import { ICommand } from "@nestjs/cqrs";
import { NotificationDataType } from "../../entities/notification.entity";

export class AddNotificationCommand implements ICommand {
  constructor(
    public readonly receiverNickname: string,
    public readonly data: NotificationDataType,
  ) {}
}
