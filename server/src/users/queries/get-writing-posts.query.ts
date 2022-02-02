import { IQuery } from "@nestjs/cqrs";

export class GetWritingPostsQuery implements IQuery {
  constructor(public readonly nickname: string) {}
}
