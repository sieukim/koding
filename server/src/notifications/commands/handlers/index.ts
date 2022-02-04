import { AddNotificationHandler } from "./add-notification.handler";
import { DeleteNotificationHandler } from "./delete-notification.handler";
import { MarkReadAllNotificationsHandler } from "./mark-read-all-notifications.handler";
import { MarkReadNotificationHandler } from "./mark-read-notification.handler";

export const NotificationCommandHandlers = [
  AddNotificationHandler,
  DeleteNotificationHandler,
  MarkReadAllNotificationsHandler,
  MarkReadNotificationHandler,
];
