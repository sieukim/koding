import { IQuery } from "@nestjs/cqrs";

export class CheckPasswordTokenValidityQuery implements IQuery {
  constructor(
    public readonly email: string,
    public readonly verifyToken: string,
  ) {}
}
