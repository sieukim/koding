import { ICommand } from "@nestjs/cqrs";

export class SetAdminCommand implements ICommand {
  constructor(public readonly nickname: string) {}
}
