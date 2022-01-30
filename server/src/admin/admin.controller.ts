import {
  Controller,
  Delete,
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
import { CommandBus } from "@nestjs/cqrs";
import { ForceDeletePostCommand } from "./commands/force-delete-post.command";
import { ForceDeleteCommentCommand } from "./commands/force-delete-comment.command";
import {
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

@ApiTags("ADMIN")
@UseGuards(VerifiedUserGuard)
@HasRoles(Role.Admin)
@Controller("api/admin")
export class AdminController {
  constructor(private readonly commandBus: CommandBus) {}

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
}
