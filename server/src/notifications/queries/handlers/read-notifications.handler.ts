import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ReadNotificationsQuery } from "../read-notifications.query";
import { Notification } from "../../../entities/notification.entity";
import { ReadNotificationsDto } from "../../dto/read-notifications.dto";
import { EntityManager, Transaction, TransactionManager } from "typeorm";

@QueryHandler(ReadNotificationsQuery)
export class ReadNotificationsHandler
  implements IQueryHandler<ReadNotificationsQuery>
{
  @Transaction()
  async execute(
    query: ReadNotificationsQuery,
    @TransactionManager() tm?: EntityManager,
  ) {
    const em = tm!;
    const { nickname, cursorNotificationId, pageSize } = query;
    let nextPageCursor: string | undefined;
    const qb = em
      .createQueryBuilder(Notification, "notification")
      .where("notification.receiverNickname = :nickname", { nickname })
      .orderBy("notification.createdAt", "DESC")
      .addOrderBy("notification.notificationId", "DESC")
      .limit(pageSize);
    if (cursorNotificationId) {
      const [createdAt, notificationId] = cursorNotificationId.split(",");
      qb.andWhere(
        "(notification.createdAt < :createdAt OR (notification.createdAt = :createdAt AND notification.notificationId < :notificationId))",
        { createdAt: new Date(parseInt(createdAt)), notificationId },
      );
    }

    const notifications = await qb.getMany();
    if (notifications.length === pageSize) {
      const { createdAt, notificationId } = notifications[pageSize - 1];
      nextPageCursor = [createdAt.getTime().toString(), notificationId].join(
        ",",
      );
    }
    return new ReadNotificationsDto(notifications, nextPageCursor);
  }
}
