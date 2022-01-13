import { IQuery } from "@nestjs/cqrs";

export class CheckFollowingQuery implements IQuery {
  constructor(
    public readonly fromNickname: string,
    public readonly toNickname: string,
  ) {}
}
