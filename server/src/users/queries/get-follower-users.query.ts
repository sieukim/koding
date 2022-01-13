import { IQuery } from "@nestjs/cqrs";

export class GetFollowerUsersQuery implements IQuery {
  constructor(public readonly nickname: string) {}
}
