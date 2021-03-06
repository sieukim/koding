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
  description: "κΆν μμ",
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
   * μ μ½μ μλ νμΈ
   */
  @ApiQuery({
    name: "read",
    type: Boolean,
  })
  @ApiNoContentResponse({
    description: "μ μ½μ μλμ΄ μμ",
  })
  @ApiNotFoundResponse({
    description: "μ μ½μ μλμ΄ μμ",
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
      throw new NotFoundException("μ μ½μ μλ¦Όμ΄ μμ΅λλ€");
    return;
  }

  @ApiOperation({
    summary: "μλ¦Ό μ‘°ν",
  })
  @ApiNotFoundResponse({
    description: "μλͺ»λ μ¬μ©μ λλ€μ",
  })
  @ApiOkResponse({
    description: "μλ¦Ό μ‘°ν μ±κ³΅",
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
   * μλ¦Ό λͺ¨λ μ½μ μ²λ¦¬
   */
  @ApiNoContentResponse({
    description: "μλ¦Ό λͺ¨λ μ½μ μ²λ¦¬ μ±κ³΅",
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
   * μλ¦Ό μ½μ μ²λ¦¬
   */

  @ApiNoContentResponse({
    description: "μλ¦Ό μ½μ μ²λ¦¬ μ±κ³΅",
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
    summary: "μλ¦Ό μ­μ ",
  })
  @ApiNoContentResponse({
    description: "μλ¦Ό μ­μ  μ±κ³΅",
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
    summary: "μλ¦Ό μ μ²΄ μ­μ ",
  })
  @ApiNoContentResponse({
    description: "μλ¦Ό μ μ²΄ μ­μ  μ±κ³΅",
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  async deleteAllNotification(@Param() { nickname }: NicknameParamDto) {
    await this.commandBus.execute(new DeleteAllNotificationsCommand(nickname));
  }
}
