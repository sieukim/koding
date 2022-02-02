import { IQuery } from "@nestjs/cqrs";

export class GetWritingCommentsQuery implements IQuery {
  constructor(public readonly nickname: string) {}
}
