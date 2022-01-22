import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { NotificationInfoDto } from "./notification-info.dto";
import { Notification } from "../../models/notification.model";

export class ReadNotificationsDto {
  @ApiProperty({
    description: "알림들",
    type: [NotificationInfoDto],
  })
  notifications: NotificationInfoDto[];

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description:
      "다음 페이지를 가져오기 위한 커서 query 값. 마지막 페이지인 경우는 값 없음",
    example: "61d7238b7d7a9ad823c8d8a9",
  })
  nextPageCursor?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description:
      "이전 페이지를 가져오기 위한 커서 query 값. 첫 페이지인 경우는 값 없음",
    example: "61d7238b7d7a9ad823c8d8a9",
  })
  prevPageCursor?: string;

  constructor(
    notifications: Notification[],
    prevPageCursor?: string,
    nextPageCursor?: string,
  ) {
    this.prevPageCursor = prevPageCursor;
    this.nextPageCursor = nextPageCursor;
    this.notifications = notifications.map(
      (notification) => new NotificationInfoDto(notification),
    );
  }
}
