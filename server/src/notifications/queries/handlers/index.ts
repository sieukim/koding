import { ReadNotificationsHandler } from "./read-notifications.handler";
import { CheckUnreadNotificationHandler } from "./check-unread-notification.handler";

export const NotificationQueryHandlers = [
  ReadNotificationsHandler,
  CheckUnreadNotificationHandler,
];
