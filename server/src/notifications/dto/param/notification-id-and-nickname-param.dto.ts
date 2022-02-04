import { NicknameParamDto } from "../../../users/dto/param/nickname-param.dto";

export class NotificationIdAndNicknameParamDto extends NicknameParamDto {
  /*
   * 알림의 고유 아이디
   */
  notificationId: string;
}
