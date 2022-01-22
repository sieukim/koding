import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ReadNotificationsQuery } from "../read-notifications.query";
import { NotificationsRepository } from "../../notifications.repository";
import { Notification } from "../../../models/notification.model";
import { SortType } from "../../../common/repository/sort-option";
import { ReadNotificationsDto } from "../../dto/read-notifications.dto";

@QueryHandler(ReadNotificationsQuery)
export class ReadNotificationsHandler
  implements IQueryHandler<ReadNotificationsQuery>
{
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  async execute(query: ReadNotificationsQuery): Promise<any> {
    const { nickname, cursorNotificationId, pageSize } = query;
    let notifications: Notification[];
    let nextPageCursor: string | undefined;
    let prevPageCursor: string | undefined;
    if (!cursorNotificationId) {
      notifications = await this.notificationsRepository.findAll(
        {
          receiverNickname: { eq: nickname },
        },
        {
          notificationId: SortType.DESC,
        },
        pageSize + 1,
      );
    } else {
      notifications = await this.notificationsRepository.findAll(
        {
          receiverNickname: { eq: nickname },
          notificationId: { lte: cursorNotificationId },
        },
        {
          notificationId: SortType.DESC,
        },
        pageSize + 1,
      );
      const prevNotifications = await this.notificationsRepository.findAll(
        {
          receiverNickname: { eq: nickname },
          notificationId: { gt: cursorNotificationId },
        },
        { notificationId: SortType.ASC },
        pageSize,
      );
      console.log("prevNotifications", prevNotifications);
      if (prevNotifications.length > 0) {
        prevPageCursor =
          prevNotifications[prevNotifications.length - 1].notificationId;
      }
    }
    if (notifications.length === pageSize + 1) {
      const nextCursorNotification = notifications.pop();
      nextPageCursor = nextCursorNotification.notificationId;
    }
    return new ReadNotificationsDto(
      notifications,
      prevPageCursor,
      nextPageCursor,
    );
  }
}
