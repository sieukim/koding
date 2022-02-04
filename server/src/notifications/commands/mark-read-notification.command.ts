import { ICommand } from "@nestjs/cqrs";

export class MarkReadNotificationCommand implements ICommand {
  constructor(
    public readonly notificationId: string,
    public readonly nickname: string,
  ) {}
}
