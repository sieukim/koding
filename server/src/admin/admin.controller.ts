import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { HasRoles } from "../common/decorator/roles.decorator";
import { Role } from "../models/role.enum";
import { VerifiedUserGuard } from "../auth/guard/authorization/verified-user.guard";
import { LoginUser } from "../common/decorator/login-user.decorator";
import { User } from "../models/user.model";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ForceDeletePostCommand } from "./commands/force-delete-post.command";
import { ForceDeleteCommentCommand } from "./commands/force-delete-comment.command";
import {
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { SuspendUserAccountCommand } from "./commands/suspend-user-account.command";
import { SetAdminCommand } from "./commands/set-admin.command";
import { AccountSuspendResultDto } from "./dto/account-suspend-result.dto";
import { SuspendUserAccountQueryDto } from "./dto/query/suspend-user-account-query.dto";
import { UnsuspendUserAccountCommand } from "./commands/unsuspend-user-account.command";
import { PostIdentifierParamDto } from "../posts/dto/param/post-identifier-param.dto";
import { CommentIdentifierParamDto } from "../comments/dto/param/comment-identifier-param.dto";
import { CursorPagingQueryDto } from "../common/dto/query/cursor-paging-query.dto";
import { GetReportedPostsQuery } from "./queries/get-reported-posts.query";
import { GetReportedPostsHandler } from "./queries/handlers/get-reported-posts.query";
import { GetReportedPostsResultDto } from "./dto/get-reported-posts-result.dto";
import { PostIdentifierWithNicknameParamDto } from "../posts/dto/param/post-identifier-with-nickname-param.dto";
import { CancelPostReportCommand } from "./commands/cancel-post-report.command";
import { CancelPostReportHandler } from "./commands/handlers/cancel-post-report.handler";
import { CancelPostAllReportsCommand } from "./commands/cancel-post-all-reports.command";
import { CancelPostAllReportsHandler } from "./commands/handlers/cancel-post-all-reports.handler";

@ApiTags("ADMIN")
@ApiForbiddenResponse({
  description: "관리자 전용",
})
@UseGuards(VerifiedUserGuard)
@HasRoles(Role.Admin)
@Controller("api/admin")
export class AdminController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  /*
   * 관리자 추가
   */
  @HasRoles(Role.User) // TODO: 프로덕션에서는 제거
  @Post("/admins/:nickname")
  setAdmin(@Param("nickname") nickname: string) {
    return this.commandBus.execute(new SetAdminCommand(nickname));
  }

  /*
   * 사용자 계정 정지
   */
  @ApiParam({
    name: "nickname",
    description: "계정을 정지할 사용자 닉네임",
    type: String,
  })
  @ApiOkResponse({
    description: "계정 정지 성공",
    type: AccountSuspendResultDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post("/users/:nickname/suspend")
  async suspendUserAccount(
    @LoginUser() loginUser: User,
    @Param("nickname") nickname: string,
    @Query() { suspendDay, forever }: SuspendUserAccountQueryDto,
  ) {
    const user = await this.commandBus.execute(
      new SuspendUserAccountCommand(nickname, forever, suspendDay),
    );
    return AccountSuspendResultDto.fromModel(user);
  }

  /*
   * 사용자 계정 정지 해제
   */
  @ApiParam({
    name: "nickname",
    description: "계정 정지를 해제할 사용자 닉네임",
    type: String,
  })
  @ApiNoContentResponse({
    description: "계정 정지 해제 성공",
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete("/users/:nickname/suspend")
  async unsuspendUserAccount(
    @LoginUser() loginUser: User,
    @Param("nickname") nickname: string,
  ) {
    await this.commandBus.execute(new UnsuspendUserAccountCommand(nickname));
    return;
  }

  /*
   *  게시글 삭제
   */
  @ApiNoContentResponse({
    description: "게시글 삭제 성공",
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete("/posts/:boardType/:postId")
  deletePost(
    @LoginUser() user: User,
    @Param() { postId, boardType }: PostIdentifierParamDto,
  ) {
    return this.commandBus.execute(
      new ForceDeletePostCommand({ postId, boardType }),
    );
  }

  /*
   * 댓글 삭제
   */
  @ApiNoContentResponse({
    description: "댓글 삭제 성공",
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete("/posts/:boardType/:postId/comments/:commentId")
  deleteComment(
    @LoginUser() user: User,
    @Param() { boardType, commentId, postId }: CommentIdentifierParamDto,
  ) {
    return this.commandBus.execute(
      new ForceDeleteCommentCommand({ postId, boardType }, commentId),
    );
  }

  /*
   * 게시글 신고 목록 가져오기
   */
  @ApiOkResponse({
    type: GetReportedPostsResultDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get("reports/posts")
  getReportedPosts(@Query() { pageSize, cursor }: CursorPagingQueryDto) {
    return this.queryBus.execute(
      new GetReportedPostsQuery(pageSize, cursor),
    ) as ReturnType<GetReportedPostsHandler["execute"]>;
  }

  /*
   * 게시글의 특정 신고 무효화
   */
  @ApiNoContentResponse({
    description: "신고 무효화 성공",
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete("reports/posts/:boardType/:postId/:nickname")
  cancelPostReport(
    @Param()
    { nickname, postId, boardType }: PostIdentifierWithNicknameParamDto,
  ) {
    return this.commandBus.execute(
      new CancelPostReportCommand({ postId, boardType }, nickname),
    ) as ReturnType<CancelPostReportHandler["execute"]>;
  }

  /*
   * 게시글에 대한 모든 신고 무효화
   */
  @ApiNoContentResponse({
    description: "게시글에 대한 모든 신고 무효화 성공",
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete("reports/posts/:boardType/:postId")
  cancelPostReports(
    @Param()
    { postId, boardType }: PostIdentifierParamDto,
  ) {
    return this.commandBus.execute(
      new CancelPostAllReportsCommand({ postId, boardType }),
    ) as ReturnType<CancelPostAllReportsHandler["execute"]>;
  }
}
