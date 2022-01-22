import { IQuery } from "@nestjs/cqrs";

export class ReadNotificationsQuery implements IQuery {
  constructor(
    public readonly nickname: string,
    public readonly pageSize: number,
    public readonly cursorNotificationId?: string,
  ) {}
}
