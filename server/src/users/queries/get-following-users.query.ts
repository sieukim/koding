import { IQuery } from "@nestjs/cqrs";

export class GetFollowingUsersQuery implements IQuery {
  constructor(public readonly nickname: string) {}
}
