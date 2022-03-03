import { ApiProperty } from "@nestjs/swagger";
import { NotificationInfoDto } from "./notification-info.dto";
import { Notification } from "../../entities/notification.entity";
import { WithNextCursorDto } from "../../common/dto/with-next-cursor.dto";

export class ReadNotificationsDto extends WithNextCursorDto {
  @ApiProperty({
    description: "알림들",
    type: [NotificationInfoDto],
  })
  notifications: NotificationInfoDto[];

  constructor(notifications: Notification[], nextPageCursor?: string) {
    super();
    this.nextPageCursor = nextPageCursor;
    this.notifications = notifications.map(
      (notification) => new NotificationInfoDto(notification),
    );
  }
}
