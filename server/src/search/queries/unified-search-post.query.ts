import { IQuery } from "@nestjs/cqrs";

export class UnifiedSearchPostQuery implements IQuery {
  constructor(
    public readonly query: string,
    public readonly postsPerBoard: number,
  ) {}
}
