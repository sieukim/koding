import { ApiExtraModels, PickType } from "@nestjs/swagger";
import {
  Notification,
  NotificationDataTypes,
} from "../../entities/notification.entity";

@ApiExtraModels(...NotificationDataTypes)
export class NotificationInfoDto extends PickType(Notification, [
  "notificationId",
  "receiverNickname",
  "data",
  "createdAt",
  "read",
] as const) {
  constructor(notification: Notification) {
    super();
    Object.assign(this, notification);
  }
}
