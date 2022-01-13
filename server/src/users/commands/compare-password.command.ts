import { ICommand } from "@nestjs/cqrs";

export class ComparePasswordCommand implements ICommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}
