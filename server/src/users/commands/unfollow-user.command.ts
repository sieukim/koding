import { ICommand } from "@nestjs/cqrs";

export class UnfollowUserCommand implements ICommand {
  constructor(
    public readonly fromNickname: string,
    public readonly toNickname: string,
  ) {}
}
