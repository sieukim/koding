import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { HasRoles } from "../common/decorator/roles.decorator";
import { Role } from "../models/role.enum";
import { BoardTypeValidationPipe } from "../common/pipes/board-type-validation-pipe";
import { PostBoardType } from "../models/post.model";
import { VerifiedUserGuard } from "../auth/guard/authorization/verified-user.guard";
import { LoginUser } from "../common/decorator/login-user.decorator";
import { User } from "../models/user.model";
import { CommandBus } from "@nestjs/cqrs";
import { ForceDeletePostCommand } from "./commands/force-delete-post.command";
import { ForceDeleteCommentCommand } from "./commands/force-delete-comment.command";
import {
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { SuspendUserAccountCommand } from "./commands/suspend-user-account.command";
import { ForceDeleteUserAccountCommand } from "./commands/force-delete-user-account.command";
import { SetAdminCommand } from "./commands/set-admin.command";
import { AccountSuspendResultDto } from "./dto/account-suspend-result.dto";
import {
  ApiParamBoardType,
  ApiParamPostId,
} from "../common/decorator/swagger/api-param.decorator";

@ApiTags("ADMIN")
@UseGuards(VerifiedUserGuard)
@HasRoles(Role.Admin)
@Controller("api/admin")
export class AdminController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({
    summary: "관리자 추가",
  })
  @HasRoles(Role.User) // TODO: 프로덕션에서는 제거
  @Post("/admins/:nickname")
  setAdmin(@Param("nickname") nickname: string) {
    return this.commandBus.execute(new SetAdminCommand(nickname));
  }

  @ApiOperation({
    summary: "사용자 계정 삭제",
  })
  @ApiParam({
    name: "nickname",
    description: "계정을 삭제할 사용자 닉네임",
    type: String,
  })
  @ApiNoContentResponse({
    description: "계정 삭제 성공",
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete("/users/:nickname")
  deleteUserAccount(
    @LoginUser() user: User,
    @Param("nickname") nickname: string,
  ) {
    return this.commandBus.execute(new ForceDeleteUserAccountCommand(nickname));
  }

  @ApiOperation({
    summary: "사용자 계정 정지",
  })
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
  @Patch("/users/:nickname")
  async suspendUserAccount(
    @LoginUser() loginUser: User,
    @Param("nickname") nickname: string,
  ) {
    const user = await this.commandBus.execute(
      new SuspendUserAccountCommand(nickname),
    );
    return AccountSuspendResultDto.fromModel(user);
  }

  @ApiOperation({
    summary: "게시글 삭제",
  })
  @ApiParamBoardType()
  @ApiParamPostId()
  @ApiNoContentResponse({
    description: "게시글 삭제 성공",
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete("/posts/:boardType/:postId")
  deletePost(
    @LoginUser() user: User,
    @Param("boardType", BoardTypeValidationPipe) boardType: PostBoardType,
    @Param("postId") postId: string,
  ) {
    return this.commandBus.execute(
      new ForceDeletePostCommand({ postId, boardType }),
    );
  }

  @ApiOperation({
    summary: "댓글 삭제",
  })
  @ApiParamBoardType()
  @ApiParamPostId()
  @ApiParam({
    name: "commentId",
    description: "삭제할 댓글 아이디",
  })
  @ApiNoContentResponse({
    description: "댓글 삭제 성공",
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete("/posts/:boardType/:postId/comments/:commentId")
  deleteComment(
    @LoginUser() user: User,
    @Param("boardType", BoardTypeValidationPipe) boardType: PostBoardType,
    @Param("postId") postId: string,
    @Param("commentId") commentId: string,
  ) {
    return this.commandBus.execute(
      new ForceDeleteCommentCommand({ postId, boardType }, commentId),
    );
  }
}
