import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { CheckUnreadNotificationQuery } from "../check-unread-notification.query";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { Notification } from "../../../entities/notification.entity";

@QueryHandler(CheckUnreadNotificationQuery)
export class CheckUnreadNotificationHandler
  implements IQueryHandler<CheckUnreadNotificationQuery>
{
  @Transaction()
  async execute(
    query: CheckUnreadNotificationQuery,
    @TransactionManager() tm?: EntityManager,
  ): Promise<boolean> {
    const em = tm!;
    const { nickname } = query;
    return em
      .findOne(Notification, {
        where: { receiverNickname: nickname, read: false },
        select: ["notificationId"],
      })
      .then((notification) => !!notification);
  }
}
