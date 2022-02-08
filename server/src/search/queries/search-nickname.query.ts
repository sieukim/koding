import { IQuery } from "@nestjs/cqrs";

export class SearchNicknameQuery implements IQuery {
  constructor(
    public readonly nickname: string,
    public readonly pageSize: number,
    public readonly cursor?: string,
  ) {}
}
