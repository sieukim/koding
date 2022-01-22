import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import {
  ApiForbiddenResponse,
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
import { VerifiedUserGuard } from "../auth/guard/authorization/verified-user.guard";
import { LoginUser } from "../common/decorator/login-user.decorator";
import { User } from "../models/user.model";

@ApiTags("NOTIFICATION")
@ApiForbiddenResponse({
  description: "권한 없음",
})
@Controller("api/notifications")
export class NotificationsController {
  constructor(private readonly queryBus: QueryBus) {}

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
    description: "잘못된 유저 아이디",
  })
  @ApiOkResponse({
    description: "알림 조회 성공",
    type: ReadNotificationsDto,
  })
  @UseGuards(VerifiedUserGuard)
  @HttpCode(HttpStatus.OK)
  @Get(":nickname")
  readNotifications(
    @LoginUser() loginUser: User,
    @Param("nickname") nickname: string,
    @Query("cursor") cursor?: string,
  ) {
    loginUser.verifySameUser(nickname);
    console.log("cursor:", cursor);
    const pageSize = 5;
    return this.queryBus.execute(
      new ReadNotificationsQuery(nickname, pageSize, cursor),
    ) as ReturnType<ReadNotificationsHandler["execute"]>;
  }
}
