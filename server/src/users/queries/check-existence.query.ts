import { IQuery } from "@nestjs/cqrs";

export class CheckExistenceQuery implements IQuery {
  constructor(
    public readonly key: "nickname" | "email",
    public readonly value: string,
  ) {}
}
