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
  ApiBody,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
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
  @ApiParam({
    name: "nickname",
    description: "알림을 조회할 사용자 닉네임",
  })
  @ApiQuery({
    name: "cursor",
    description:
      "조회를 시작할 기준이 되는 알림 아이디. 첫 페이지를 조회하는 경우에는 값을 넣지 않음",
    type: String,
    required: false,
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
    @Param("nickname") nickname: string,
    @Query("cursor") cursor?: string,
  ) {
    this.logger.log(`getNotifications called`);
    const pageSize = 5;
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
    @Body() body: MarkReadNotificationRequestDto,
  ) {
    return this.commandBus.execute(
      new MarkReadAllNotificationsCommand(nickname),
    );
  }

  /*
   * 알림 읽음 처리
   */
  @ApiBody({
    type: MarkReadNotificationRequestDto,
  })
  @ApiNoContentResponse({
    description: "알림 읽음 처리 성공",
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(":notificationId")
  markReadNotifications(
    @Param() { notificationId, nickname }: NotificationIdAndNicknameParamDto,
    @Body() body: MarkReadNotificationRequestDto,
  ) {
    return this.commandBus.execute(
      new MarkReadNotificationCommand(notificationId, nickname),
    );
  }

  @ApiOperation({
    summary: "알림 삭제",
  })
  @ApiParam({
    name: "nickname",
    description: "삭제할 알림을 받은 사용자 닉네임",
    type: String,
  })
  @ApiParam({
    name: "notificationId",
    description: "삭제할 알림의 아이디",
    type: String,
  })
  @ApiNoContentResponse({
    description: "알림 삭제 성공",
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":notificationId")
  deleteNotification(
    @Param() { notificationId, nickname }: NotificationIdAndNicknameParamDto,
  ) {
    return this.commandBus.execute(
      new DeleteNotificationCommand(nickname, notificationId),
    );
  }
}
