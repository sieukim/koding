import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { CheckUnreadNotificationQuery } from "../check-unread-notification.query";
import { NotificationsRepository } from "../../notifications.repository";

@QueryHandler(CheckUnreadNotificationQuery)
export class CheckUnreadNotificationHandler
  implements IQueryHandler<CheckUnreadNotificationQuery>
{
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  async execute(query: CheckUnreadNotificationQuery): Promise<boolean> {
    const { nickname } = query;
    return this.notificationsRepository.exists({
      receiverNickname: { eq: nickname },
      read: { eq: false },
    });
  }
}
