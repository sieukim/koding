import { ICommand } from "@nestjs/cqrs";

export class FollowUserCommand implements ICommand {
  constructor(
    public readonly fromNickname: string,
    public readonly toNickname: string,
  ) {}
}
