import { ApiExtraModels, PickType } from "@nestjs/swagger";
import {
  Notification,
  notificationDataTypes,
} from "../../models/notification.model";

@ApiExtraModels(...notificationDataTypes)
export class NotificationInfoDto extends PickType(Notification, [
  "notificationId",
  "receiverNickname",
  "data",
  "createdAt",
] as const) {
  constructor(notification: Notification) {
    super();
    Object.assign(this, notification);
  }
}
