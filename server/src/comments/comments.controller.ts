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
  ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import {
  ApiParamBoardType,
  ApiParamPostId,
} from "../common/decorator/swagger/api-param.decorator";
import { AddCommentRequestDto } from "./dto/add-comment-request.dto";
import { CommentInfoDto } from "./dto/comment-info.dto";
import { VerifiedUserGuard } from "../auth/guard/authorization/verified-user.guard";
import { BoardTypeValidationPipe } from "../common/pipes/board-type-validation-pipe";
import { LoginUser } from "../common/decorator/login-user.decorator";
import { User } from "../models/user.model";
import { ModifyCommentRequestDto } from "./dto/modify-comment-request.dto";
import { CommentsService } from "./comments.service";
import { ReadCommentsDto } from "./dto/read-comments.dto";
import { QueryBus } from "@nestjs/cqrs";
import { ReadCommentsQuery } from "./queries/read-comments.query";
import { ReadCommentsHandler } from "./queries/handler/read-comments.handler";
import { PostBoardType } from "../models/post.model";

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
    private readonly commentsService: CommentsService,
    private readonly queryBus: QueryBus,
  ) {}

  @ApiOperation({
    summary: "게시글의 댓글 조회",
  })
  @ApiParamBoardType()
  @ApiParamPostId()
  @ApiQuery({
    name: "cursor",
    description:
      "조회를 시작할 기준이 되는 게시글 아이디. 첫 페이지를 조회하는 경우에는 값을 넣지 않음",
    type: String,
    required: false,
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
    @Param("boardType", BoardTypeValidationPipe) boardType: PostBoardType,
    @Param("postId") postId: string,
    @Query("cursor") cursor?: string,
  ) {
    const pageSize = 10;
    return this.queryBus.execute(
      new ReadCommentsQuery(
        {
          postId,
          boardType,
        },
        pageSize,
        cursor,
      ),
    ) as ReturnType<ReadCommentsHandler["execute"]>;
  }

  @ApiOperation({
    summary: "댓글 작성",
  })
  @ApiParamBoardType()
  @ApiParamPostId()
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
    @Param("boardType", BoardTypeValidationPipe) boardType: PostBoardType,
    @Param("postId") postId: string,
    @LoginUser() user: User,
    @Body() body: AddCommentRequestDto,
  ) {
    const newComment = await this.commentsService.addComment(
      user,
      { boardType, postId },
      body,
    );
    return new CommentInfoDto(newComment);
  }

  @ApiOperation({
    summary: "댓글 수정",
  })
  @ApiBody({
    type: ModifyCommentRequestDto,
  })
  @ApiParamBoardType()
  @ApiParamPostId()
  @ApiParam({
    name: "commentId",
    description: "댓글 아이디",
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
    @Param("boardType", BoardTypeValidationPipe) boardType: PostBoardType,
    @Param("postId") postId: string,
    @Param("commentId") commentId: string,
    @Body() body: ModifyCommentRequestDto,
    @LoginUser() user: User,
  ) {
    const comment = await this.commentsService.modifyComment(
      user,
      { boardType, postId },
      commentId,
      body,
    );
    return new CommentInfoDto(comment);
  }

  @ApiOperation({
    summary: "댓글 삭제",
  })
  @ApiParamBoardType()
  @ApiParamPostId()
  @ApiParam({
    name: "commentId",
    description: "댓글 아이디",
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
    @Param("boardType", BoardTypeValidationPipe) boardType: PostBoardType,
    @Param("postId") postId: string,
    @Param("commentId") commentId: string,
    @LoginUser() user: User,
  ) {
    await this.commentsService.deleteComment(
      user,
      { boardType, postId },
      commentId,
    );
  }
}
