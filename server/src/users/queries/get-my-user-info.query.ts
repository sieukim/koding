import { IQuery } from "@nestjs/cqrs";

export class GetMyUserInfoQuery implements IQuery {
  constructor(public readonly myNickname) {}
}
