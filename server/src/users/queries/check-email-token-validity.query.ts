import { IQuery } from "@nestjs/cqrs";

export class CheckEmailTokenValidityQuery implements IQuery {
  constructor(
    public readonly email: string,
    public readonly verifyToken: string,
  ) {}
}
