import { IQuery } from "@nestjs/cqrs";

export class GetPostsOfFollowingsQuery implements IQuery {
  constructor(
    public readonly nickname: string,
    public readonly pageSize: number,
    public readonly cursor?: string,
  ) {}
}
