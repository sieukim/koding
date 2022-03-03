import {
  Body,
  Controller,
  Delete,
  Get,
  Head,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import {
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { ReadNotificationsDto } from "./dto/read-notifications.dto";
import { ReadNotificationsHandler } from "./queries/handlers/read-notifications.handler";
import { ReadNotificationsQuery } from "./queries/read-notifications.query";
import { DeleteNotificationCommand } from "./commands/delete-notification.command";
import { MarkReadNotificationRequestDto } from "./dto/mark-read-notification-request.dto";
import { ParamNicknameSameUserGuard } from "../auth/guard/authorization/param-nickname-same-user.guard";
import { NicknameParamDto } from "../users/dto/param/nickname-param.dto";
import { MarkReadAllNotificationsCommand } from "./commands/mark-read-all-notifications.command";
import { NotificationIdAndNicknameParamDto } from "./dto/param/notification-id-and-nickname-param.dto";
import { MarkReadNotificationCommand } from "./commands/mark-read-notification.command";
import { CheckUnreadNotificationQueryDto } from "./dto/query/check-unread-notification-query.dto";
import { CheckUnreadNotificationQuery } from "./queries/check-unread-notification.query";
import { CheckUnreadNotificationHandler } from "./queries/handlers/check-unread-notification.handler";
import { CursorPagingQueryDto } from "../common/dto/query/cursor-paging-query.dto";
import { DeleteAllNotificationsCommand } from "./commands/delete-all-notifications.command";

@ApiTags("NOTIFICATION")
@ApiForbiddenResponse({
  description: "권한 없음",
})
@UseGuards(ParamNicknameSameUserGuard)
@Controller("api/notifications/:nickname")
export class NotificationsController {
  private readonly logger = new Logger(NotificationsController.name);

  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  /*
   * 안 읽은 알람 확인
   */
  @ApiQuery({
    name: "read",
    type: Boolean,
  })
  @ApiNoContentResponse({
    description: "안 읽은 알람이 있음",
  })
  @ApiNotFoundResponse({
    description: "안 읽은 알람이 없음",
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Head()
  async checkUnreadNotificationExistence(
    @Param() { nickname }: NicknameParamDto,
    @Query() { read }: CheckUnreadNotificationQueryDto,
  ) {
    const unreadNotificationExistence = (await this.queryBus.execute(
      new CheckUnreadNotificationQuery(nickname),
    )) as Awaited<ReturnType<CheckUnreadNotificationHandler["execute"]>>;
    if (!unreadNotificationExistence)
      throw new NotFoundException("안 읽은 알림이 없습니다");
    return;
  }

  @ApiOperation({
    summary: "알림 조회",
  })
  @ApiNotFoundResponse({
    description: "잘못된 사용자 닉네임",
  })
  @ApiOkResponse({
    description: "알림 조회 성공",
    type: ReadNotificationsDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  getNotifications(
    @Param() { nickname }: NicknameParamDto,
    @Query() { cursor, pageSize }: CursorPagingQueryDto,
  ) {
    this.logger.log(`getNotifications called`);
    return this.queryBus.execute(
      new ReadNotificationsQuery(nickname, pageSize, cursor),
    ) as ReturnType<ReadNotificationsHandler["execute"]>;
  }

  /*
   * 알림 모두 읽음 처리
   */
  @ApiNoContentResponse({
    description: "알림 모두 읽음 처리 성공",
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch()
  markReadAllNotifications(
    @Param() { nickname }: NicknameParamDto,
    @Body() { read }: MarkReadNotificationRequestDto,
  ) {
    return this.commandBus.execute(
      new MarkReadAllNotificationsCommand(nickname),
    );
  }

  /*
   * 알림 읽음 처리
   */

  @ApiNoContentResponse({
    description: "알림 읽음 처리 성공",
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(":notificationId")
  async markReadNotifications(
    @Param() { notificationId, nickname }: NotificationIdAndNicknameParamDto,
    @Body() body: MarkReadNotificationRequestDto,
  ) {
    await this.commandBus.execute(
      new MarkReadNotificationCommand(notificationId, nickname),
    );
  }

  @ApiOperation({
    summary: "알림 삭제",
  })
  @ApiNoContentResponse({
    description: "알림 삭제 성공",
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":notificationId")
  async deleteNotification(
    @Param() { notificationId, nickname }: NotificationIdAndNicknameParamDto,
  ) {
    await this.commandBus.execute(
      new DeleteNotificationCommand(nickname, notificationId),
    );
  }

  @ApiOperation({
    summary: "알림 전체 삭제",
  })
  @ApiNoContentResponse({
    description: "알림 전체 삭제 성공",
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  async deleteAllNotification(@Param() { nickname }: NicknameParamDto) {
    await this.commandBus.execute(new DeleteAllNotificationsCommand(nickname));
  }
}
