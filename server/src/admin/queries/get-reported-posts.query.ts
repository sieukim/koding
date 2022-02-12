import { IQuery } from "@nestjs/cqrs";

export class GetReportedPostsQuery implements IQuery {
  constructor(
    public readonly pageSize: number,
    public readonly cursor?: string,
  ) {}
}
