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
import { WritePostRequestDto } from "./dto/write-post-request.dto";
import { PostsService } from "./posts.service";
import { ReadPostDto } from "./dto/read-post.dto";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { VerifiedUserGuard } from "../auth/guard/authorization/verified-user.guard";
import { LoginUser } from "../common/decorator/login-user.decorator";
import { ModifyPostRequestDto } from "./dto/modify-post-request.dto";
import { BoardTypeValidationPipe } from "../common/pipes/board-type-validation-pipe";
import {
  ApiParamBoardType,
  ApiParamPostId,
} from "../common/decorator/swagger/api-param.decorator";

import { CursorPostsDto } from "./dto/cursor-posts.dto";
import { ReadPostWithAroundDto } from "./dto/read-post-with-around.dto";
import { ReadPostFilter } from "./dto/read-post.filter";
import { User } from "../models/user.model";
import { PostBoardType } from "../models/post.model";

@ApiTags("POST")
@ApiBadRequestResponse({
  description: "param, query, body 중 유효하지 않은 요청값이 존재",
})
@ApiForbiddenResponse({
  description: "인증되지 않은 사용자이거나 권한 없음",
})
@Controller("api/posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({
    summary: "게시글 쓰기",
  })
  @ApiParamBoardType()
  @ApiBody({
    type: WritePostRequestDto,
  })
  @ApiCreatedResponse({
    description: "게시글 쓰기 성공",
    type: ReadPostDto,
  })
  @UseGuards(VerifiedUserGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post(":boardType")
  async writePost(
    @LoginUser() user: User,
    @Param("boardType", BoardTypeValidationPipe) boardType: PostBoardType,
    @Body() body: WritePostRequestDto,
  ) {
    const post = await this.postsService.writePost(boardType, user, body);
    return new ReadPostDto(post);
  }

  @ApiOperation({
    summary: "게시글 목록 조회",
  })
  @ApiParamBoardType()
  @ApiQuery({
    name: "cursor",
    description:
      "조회를 시작할 기준이 되는 게시글 아이디. 첫 페이지를 조회하는 경우에는 값을 넣지 않음",
    type: String,
    required: false,
  })
  @ApiQuery({
    name: "tags",
    description:
      "검색할 태그들. 여러개인 경우 , 로 구분하며, 각각은 OR로 묶임. 검색이 필요 없는 경우 값을 넣지 않음",
    examples: {
      "여러 태그를 or로 검색": {
        value: "react,hooks",
      },
      "하나의 태그만 검색": {
        value: "nestjs",
      },
    },
  })
  @ApiOkResponse({
    description: "게시글 목록 조회 성공",
    type: CursorPostsDto,
  })
  @Get(":boardType")
  async readPosts(
    @Param("boardType", BoardTypeValidationPipe) boardType: PostBoardType,
    @Query() { cursor, tags }: ReadPostFilter,
  ) {
    const pageSize = 10;
    const { posts, prevPageCursor, nextPageCursor } =
      await this.postsService.getPostsWithCursor(boardType, pageSize, cursor, {
        tags,
      });
    return new CursorPostsDto(posts, prevPageCursor, nextPageCursor);
  }

  @ApiOperation({
    summary: "게시글 읽기",
  })
  @ApiParamBoardType()
  @ApiParamPostId()
  @ApiNotFoundResponse({
    description: "잘못된 게시글 아이디",
  })
  @ApiOkResponse({
    description: "게시글 읽기 성공",
    type: ReadPostWithAroundDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get(":boardType/:postId")
  async readPost(
    @Param("boardType", BoardTypeValidationPipe) boardType: PostBoardType,
    @Param("postId") postId: string,
  ) {
    return await this.postsService.readPost({ boardType, postId });
  }

  @ApiOperation({
    summary: "게시글 수정",
  })
  @ApiBody({
    type: ModifyPostRequestDto,
  })
  @ApiParamBoardType()
  @ApiParamPostId()
  @ApiNotFoundResponse({
    description: "잘못된 게시글 아이디",
  })
  @ApiOkResponse({
    description: "게시글 수정 성공",
    type: ReadPostDto,
  })
  @UseGuards(VerifiedUserGuard)
  @HttpCode(HttpStatus.OK)
  @Patch(":boardType/:postId")
  async modifyPost(
    @Param("boardType", BoardTypeValidationPipe) boardType: PostBoardType,
    @Param("postId") postId: string,
    @Body() body: ModifyPostRequestDto,
    @LoginUser() user: User,
  ) {
    const post = await this.postsService.modifyPost(
      user,
      { boardType, postId },
      body,
    );
    return new ReadPostDto(post);
  }

  @ApiOperation({
    summary: "게시글 삭제",
  })
  @ApiParamBoardType()
  @ApiParamPostId()
  @ApiNotFoundResponse({
    description: "잘못된 게시글 아이디",
  })
  @ApiNoContentResponse({
    description: "게시글 식제 성공",
  })
  @UseGuards(VerifiedUserGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":boardType/:postId")
  async deletePost(
    @Param("boardType", BoardTypeValidationPipe) boardType: PostBoardType,
    @Param("postId") postId: string,
    @LoginUser() user: User,
  ) {
    await this.postsService.deletePost(user, { boardType, postId });
  }
}
