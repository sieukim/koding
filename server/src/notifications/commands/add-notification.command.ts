import { ICommand } from "@nestjs/cqrs";
import { NotificationDataType } from "../../models/notification.model";

export class AddNotificationCommand implements ICommand {
  constructor(
    public readonly receiverNickname: string,
    public readonly data: NotificationDataType,
  ) {}
}
