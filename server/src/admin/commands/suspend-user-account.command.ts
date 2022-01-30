import { ICommand } from "@nestjs/cqrs";

export class SuspendUserAccountCommand implements ICommand {
  constructor(public readonly nickname: string) {}
}
