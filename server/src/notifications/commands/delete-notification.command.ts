import { ICommand } from "@nestjs/cqrs";

export class DeleteNotificationCommand implements ICommand {
  constructor(
    public readonly receiverNickname: string,
    public readonly notificationId: string,
  ) {}
}
