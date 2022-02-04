import { ICommand } from "@nestjs/cqrs";

export class DeleteAllNotificationsCommand implements ICommand {
  constructor(public readonly nickname: string) {}
}
