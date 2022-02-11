import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { AddCommentRequestDto } from "./dto/add-comment-request.dto";
import { CommentInfoDto } from "./dto/comment-info.dto";
import { VerifiedUserGuard } from "../auth/guard/authorization/verified-user.guard";
import { LoginUser } from "../common/decorator/login-user.decorator";
import { User } from "../models/user.model";
import { ModifyCommentRequestDto } from "./dto/modify-comment-request.dto";
import { ReadCommentsDto } from "./dto/read-comments.dto";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ReadCommentsQuery } from "./queries/read-comments.query";
import { ReadCommentsHandler } from "./queries/handler/read-comments.handler";
import { PostIdentifierParamDto } from "../posts/dto/param/post-identifier-param.dto";
import { CommentIdentifierParamDto } from "./dto/param/comment-identifier-param.dto";
import { CursorPagingQueryDto } from "../common/dto/query/cursor-paging-query.dto";
import { AddCommentCommand } from "./commands/add-comment.command";
import { AddCommentHandler } from "./commands/handlers/add-comment.handler";
import { ModifyCommentCommand } from "./commands/modify-comment.command";
import { ModifyCommentHandler } from "./commands/handlers/modify-comment.handler";
import { DeleteCommentCommand } from "./commands/delete-comment.command";
import { ParamNicknameSameUserGuard } from "../auth/guard/authorization/param-nickname-same-user.guard";
import { CommentIdentifierWithNicknameParamDto } from "./dto/param/comment-identifier-with-nickname-param.dto";
import { LikeCommentCommand } from "./commands/like-comment.command";
import { UnlikeCommentCommand } from "./commands/unlike-comment.command";

@ApiTags("POST/COMMENT")
@ApiBadRequestResponse({
  description: "param, query, body 중 유효하지 않은 요청값이 존재",
})
@ApiForbiddenResponse({
  description: "인증되지 않은 사용자이거나 권한 없음",
})
@Controller("api/posts/:boardType/:postId/comments")
export class CommentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @ApiOperation({
    summary: "게시글의 댓글 조회",
  })
  @ApiNotFoundResponse({
    description: "잘못된 게시글 아이디",
  })
  @ApiOkResponse({
    description: "댓글 조회 성공",
    type: ReadCommentsDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  readComments(
    @Param() { boardType, postId }: PostIdentifierParamDto,
    @Query() { cursor, pageSize }: CursorPagingQueryDto,
    @LoginUser() loginUser?: User,
  ) {
    return this.queryBus.execute(
      new ReadCommentsQuery(
        {
          postId,
          boardType,
        },
        pageSize,
        cursor,
        loginUser?.nickname,
      ),
    ) as ReturnType<ReadCommentsHandler["execute"]>;
  }

  @ApiOperation({
    summary: "댓글 작성",
  })
  @ApiBody({
    type: AddCommentRequestDto,
  })
  @ApiNotFoundResponse({
    description: "잘못된 게시글 아이디",
  })
  @ApiOkResponse({
    description: "댓글 작성 성공",
    type: CommentInfoDto,
  })
  @UseGuards(VerifiedUserGuard)
  @HttpCode(HttpStatus.OK)
  @Post()
  async addComment(
    @Param() { boardType, postId }: PostIdentifierParamDto,
    @LoginUser() user: User,
    @Body() body: AddCommentRequestDto,
  ) {
    const newComment = (await this.commandBus.execute(
      new AddCommentCommand(user.nickname, { boardType, postId }, body),
    )) as Awaited<ReturnType<AddCommentHandler["execute"]>>;
    return CommentInfoDto.fromModel(newComment);
  }

  @ApiOperation({
    summary: "댓글 수정",
  })
  @ApiBody({
    type: ModifyCommentRequestDto,
  })
  @ApiNotFoundResponse({
    description: "잘못된 게시글 혹은 댓글 아이디",
  })
  @ApiOkResponse({
    description: "게시글 수정 성공",
    type: CommentInfoDto,
  })
  @UseGuards(VerifiedUserGuard)
  @HttpCode(HttpStatus.OK)
  @Patch(":commentId")
  async modifyComment(
    @Param() { boardType, postId, commentId }: CommentIdentifierParamDto,
    @Body() body: ModifyCommentRequestDto,
    @LoginUser() user: User,
  ) {
    const comment = (await this.commandBus.execute(
      new ModifyCommentCommand(
        user.nickname,
        { boardType, postId },
        commentId,
        body,
      ),
    )) as Awaited<ReturnType<ModifyCommentHandler["execute"]>>;
    return CommentInfoDto.fromModel(comment);
  }

  @ApiOperation({
    summary: "댓글 삭제",
  })
  @ApiNotFoundResponse({
    description: "잘못된 게시글 혹은 댓글 아이디",
  })
  @ApiNoContentResponse({
    description: "게시글 식제 성공",
  })
  @UseGuards(VerifiedUserGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":commentId")
  async deleteComment(
    @Param() { boardType, postId, commentId }: CommentIdentifierParamDto,
    @LoginUser() user: User,
  ) {
    await this.commandBus.execute(
      new DeleteCommentCommand(user.nickname, { boardType, postId }, commentId),
    );
  }

  /*
   * 댓글 좋아요 요청
   */
  @ApiNoContentResponse({
    description: "좋아요 요청 성공(이미 좋아요를 누른 경우도 포함)",
  })
  @UseGuards(ParamNicknameSameUserGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(":commentId/like/:nickname")
  async likeComment(
    @Param()
    {
      commentId,
      postId,
      boardType,
      nickname,
    }: CommentIdentifierWithNicknameParamDto,
  ) {
    await this.commandBus.execute(
      new LikeCommentCommand({ postId, boardType }, commentId, nickname),
    );
    return;
  }

  /*
   * 댓글 좋아요 취소 요청
   */
  @ApiNoContentResponse({
    description: "좋아요 취소 성공(이미 좋아요를 하지 않았던 경우도 포함)",
  })
  @UseGuards(ParamNicknameSameUserGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":commentId/like/:nickname")
  async unlikeComment(
    @Param()
    {
      commentId,
      postId,
      boardType,
      nickname,
    }: CommentIdentifierWithNicknameParamDto,
  ) {
    await this.commandBus.execute(
      new UnlikeCommentCommand({ postId, boardType }, commentId, nickname),
    );
    return;
  }
}
