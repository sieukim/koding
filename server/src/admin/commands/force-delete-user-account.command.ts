import { ICommand } from "@nestjs/cqrs";

export class ForceDeleteUserAccountCommand implements ICommand {
  constructor(public readonly nickname: string) {}
}
