import { ICommand } from "@nestjs/cqrs";

export class MarkReadAllNotificationsCommand implements ICommand {
  constructor(public readonly nickname: string) {}
}
