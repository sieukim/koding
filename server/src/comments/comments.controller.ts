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
import { ReadCommentDto } from "./dto/read-comment.dto";
import { QueryBus } from "@nestjs/cqrs";
import { ReadCommentQuery } from "./queries/read-comment.query";
import { ReadCommentHandler } from "./queries/handler/read-comment.handler";
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
  @ApiNotFoundResponse({
    description: "잘못된 게시글 아이디",
  })
  @ApiOkResponse({
    description: "댓글 조회 성공",
    type: ReadCommentDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  readComments(
    @Param("boardType", BoardTypeValidationPipe) boardType: PostBoardType,
    @Param("postId") postId: string,
  ) {
    return this.queryBus.execute(
      new ReadCommentQuery({
        postId,
        boardType,
      }),
    ) as ReturnType<ReadCommentHandler["execute"]>;
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
