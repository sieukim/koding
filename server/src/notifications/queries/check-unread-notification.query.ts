import { IQuery } from "@nestjs/cqrs";

export class CheckUnreadNotificationQuery implements IQuery {
  constructor(public readonly nickname: string) {}
}
