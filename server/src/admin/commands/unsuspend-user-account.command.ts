import { ICommand } from "@nestjs/cqrs";

export class UnsuspendUserAccountCommand implements ICommand {
  constructor(public readonly nickname: string) {}
}
