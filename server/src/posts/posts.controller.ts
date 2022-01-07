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
  UseGuards
} from "@nestjs/common";
import { WritePostRequestDto } from "./dto/posts/write-post-request.dto";
import { PostsService } from "./posts.service";
import { ReadPostDto } from "./dto/posts/read-post.dto";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags
} from "@nestjs/swagger";
import { VerifiedUserGuard } from "../auth/guard/authorization/verified-user.guard";
import { LoginUser } from "../common/decorator/login-user.decorator";
import { User } from "../schemas/user.schema";
import { ModifyPostRequestDto } from "./dto/posts/modify-post-request.dto";
import { ReadPostWithWriterDto } from "./dto/posts/read-post-with-writer.dto";
import { BoardTypeValidationPipe } from "../common/pipes/board-type-validation-pipe";
import { ApiParamBoardType, ApiParamPostId } from "../common/decorator/swagger/api-param.decorator";
import { PostBoardType } from "../schemas/post.schema";
import { AddCommentRequestDto } from "./dto/comments/add-comment-request.dto";
import { ReadCommentDto } from "./dto/comments/read-comment.dto";
import { ModifyCommentRequestDto } from "./dto/comments/modify-comment-request.dto";
import { CursorPostsDto } from "./dto/posts/cursor-posts.dto";

@ApiTags("POST")
@ApiBadRequestResponse({
  description: "param, query, body 중 유효하지 않은 요청값이 존재"
})
@ApiForbiddenResponse({
  description: "인증되지 않은 사용자이거나 권한 없음"
})
@Controller("api/posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {
  }

  @ApiOperation({
    summary: "게시글 쓰기"
  })
  @ApiParamBoardType()
  @ApiBody({
    type: WritePostRequestDto
  })
  @ApiCreatedResponse({
    description: "게시글 쓰기 성공",
    type: ReadPostDto
  })
  @UseGuards(VerifiedUserGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post(":boardType")
  async writePost(@LoginUser() user: User, @Param("boardType", BoardTypeValidationPipe) boardType: PostBoardType, @Body() body: WritePostRequestDto) {
    const post = await this.postsService.writePost(boardType, user, body);
    return new ReadPostDto(post);
  }

  @ApiOperation({
    summary: "게시글 목록 조회"
  })
  @ApiParamBoardType()
  @ApiQuery({
    name: "cursor",
    description: "조회를 시작할 기준이 되는 게시글 아이디. 첫 페이지를 조회하는 경우에는 값을 넣지 않음",
    type: String,
    required: false
  })
  @ApiOkResponse({
    description: "게시글 목록 조회 성공",
    type: CursorPostsDto
  })
  @Get(":boardType")
  async readPosts(@Param("boardType", BoardTypeValidationPipe) boardType: PostBoardType, @Query("cursor") cursor?: string) {
    const pageSize = 10;
    const posts = await this.postsService.getPostsWithCursor(boardType, cursor, pageSize);
    if (posts.length === pageSize + 1) {
      const nextCursorPost = posts.pop();
      const nextPageUrl = `/api/posts/${boardType}?${new URLSearchParams({ cursor: nextCursorPost._id.toString() })}`;
      return new CursorPostsDto(posts, nextPageUrl);
    } else
      return new CursorPostsDto(posts);
  }

  @ApiOperation({
    summary: "게시글 읽기"
  })
  @ApiParamBoardType()
  @ApiParamPostId()
  @ApiNotFoundResponse({
    description: "잘못된 게시글 아이디"
  })
  @ApiOkResponse({
    description: "게시글 읽기 성공",
    type: ReadPostWithWriterDto
  })
  @HttpCode(HttpStatus.OK)
  @Get(":boardType/:postId")
  async readPost(@Param("boardType", BoardTypeValidationPipe) boardType: PostBoardType, @Param("postId") postId: string) {
    const post = await this.postsService.readPost({ boardType, postId });
    console.log(post);
    return new ReadPostWithWriterDto(post, post.writer as User);
  }

  @ApiOperation({
    summary: "게시글 수정"
  })
  @ApiBody({
    type: ModifyPostRequestDto
  })
  @ApiParamBoardType()
  @ApiParamPostId()
  @ApiNotFoundResponse({
    description: "잘못된 게시글 아이디"
  })
  @ApiOkResponse({
    description: "게시글 수정 성공",
    type: ReadPostDto
  })
  @UseGuards(VerifiedUserGuard)
  @HttpCode(HttpStatus.OK)
  @Patch(":boardType/:postId")
  async modifyPost(@Param("boardType", BoardTypeValidationPipe) boardType: PostBoardType, @Param("postId") postId: string, @Body() body: ModifyPostRequestDto, @LoginUser() user: User) {
    const post = await this.postsService.modifyPost(user, { boardType, postId }, body);
    return new ReadPostDto(post);
  }

  @ApiOperation({
    summary: "게시글 삭제"
  })
  @ApiParamBoardType()
  @ApiParamPostId()
  @ApiNotFoundResponse({
    description: "잘못된 게시글 아이디"
  })
  @ApiNoContentResponse({
    description: "게시글 식제 성공"
  })
  @UseGuards(VerifiedUserGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":boardType/:postId")
  async deletePost(@Param("boardType", BoardTypeValidationPipe) boardType: PostBoardType, @Param("postId") postId: string, @LoginUser() user: User) {
    await this.postsService.deletePost(user, { boardType, postId });
  }

  @ApiOperation({
    summary: "댓글 작성"
  })
  @ApiParamBoardType()
  @ApiParamPostId()
  @ApiBody({
    type: AddCommentRequestDto
  })
  @ApiNotFoundResponse({
    description: "잘못된 게시글 아이디"
  })
  @ApiOkResponse({
    description: "댓글 작성 성공",
    type: ReadCommentDto
  })
  @UseGuards(VerifiedUserGuard)
  @HttpCode(HttpStatus.OK)
  @Post(":boardType/:postId/comments")
  async addComment(@Param("boardType", BoardTypeValidationPipe) boardType: PostBoardType, @Param("postId") postId: string, @LoginUser() user: User,
                   @Body() body: AddCommentRequestDto) {
    const newComment = await this.postsService.addComment(user, { boardType, postId }, body);
    return new ReadCommentDto(newComment);
  }

  @ApiOperation({
    summary: "댓글글 수정"
  })
  @ApiBody({
    type: ModifyCommentRequestDto
  })
  @ApiParamBoardType()
  @ApiParamPostId()
  @ApiParam({
    name: "commentId",
    description: "댓글 아이디"
  })
  @ApiNotFoundResponse({
    description: "잘못된 게시글 혹은 댓글 아이디"
  })
  @ApiOkResponse({
    description: "게시글 수정 성공",
    type: ReadCommentDto
  })
  @UseGuards(VerifiedUserGuard)
  @HttpCode(HttpStatus.OK)
  @Patch(":boardType/:postId/comments/:commentId")
  async modifyComment(@Param("boardType", BoardTypeValidationPipe) boardType: PostBoardType, @Param("postId") postId: string, @Param("commentId") commentId: string, @Body() body: ModifyCommentRequestDto, @LoginUser() user: User) {
    const comment = await this.postsService.modifyComment(user, { boardType, postId }, commentId, body);
    return new ReadCommentDto(comment);
  }


  @ApiOperation({
    summary: "댓글 삭제"
  })
  @ApiParamBoardType()
  @ApiParamPostId()
  @ApiParam({
    name: "commentId",
    description: "댓글 아이디"
  })
  @ApiNotFoundResponse({
    description: "잘못된 게시글 혹은 댓글 아이디"
  })
  @ApiNoContentResponse({
    description: "게시글 식제 성공"
  })
  @UseGuards(VerifiedUserGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":boardType/:postId/comments/:commentId")
  async deleteComment(@Param("boardType", BoardTypeValidationPipe) boardType: PostBoardType, @Param("postId") postId: string, @Param("commentId") commentId: string, @LoginUser() user: User) {
    await this.postsService.deleteComment(user, { boardType, postId }, commentId);
  }
}
