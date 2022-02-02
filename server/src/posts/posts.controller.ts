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
import { PostInfoDto } from "./dto/post-info.dto";
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

import { PostListDto } from "./dto/post-list.dto";
import { PostWithAroundInfoDto } from "./dto/post-with-around-info.dto";
import { ReadPostQueryDto } from "./dto/query/read-post-query.dto";
import { User } from "../models/user.model";
import { QueryBus } from "@nestjs/cqrs";
import { GetPostListQuery } from "./query/get-post-list.query";
import { ReadPostQuery } from "./query/read-post.query";
import { BoardTypeParamDto } from "./dto/param/board-type-param.dto";
import { PostIdentifierParamDto } from "./dto/param/post-identifier-param.dto";

@ApiTags("POST")
@ApiBadRequestResponse({
  description: "param, query, body 중 유효하지 않은 요청값이 존재",
})
@ApiForbiddenResponse({
  description: "인증되지 않은 사용자이거나 권한 없음",
})
@Controller("api/posts")
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly queryBus: QueryBus,
  ) {}

  @ApiOperation({
    summary: "게시글 쓰기",
  })
  @ApiBody({
    type: WritePostRequestDto,
  })
  @ApiCreatedResponse({
    description: "게시글 쓰기 성공",
    type: PostInfoDto,
  })
  @UseGuards(VerifiedUserGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post(":boardType")
  async writePost(
    @LoginUser() user: User,
    @Param() { boardType }: BoardTypeParamDto,
    @Body() body: WritePostRequestDto,
  ) {
    const post = await this.postsService.writePost(boardType, user, body);
    return PostInfoDto.fromModel(post);
  }

  @ApiOperation({
    summary: "게시글 목록 조회",
  })
  @ApiQuery({
    name: "cursor",
    description:
      "조회를 시작할 기준이 되는 커서. 첫 페이지를 조회하는 경우에는 값을 넣지 않음",
    type: String,
    required: false,
  })
  @ApiQuery({
    required: false,
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
    type: String,
  })
  @ApiQuery({
    required: false,
    name: "writer",
    description: "검색할 작성자. 검색이 필요 없는 경우 값을 넣지 않음",
    example: "testNickname",
  })
  @ApiOkResponse({
    description: "게시글 목록 조회 성공",
    type: PostListDto,
  })
  @Get(":boardType")
  async readPosts(
    @Param() { boardType }: BoardTypeParamDto,
    @Query() { cursor, tags, writer }: ReadPostQueryDto,
  ) {
    const pageSize = 10;
    return this.queryBus.execute(
      new GetPostListQuery(boardType, pageSize, cursor, { tags, writer }),
    );
  }

  @ApiOperation({
    summary: "게시글 읽기",
  })
  @ApiNotFoundResponse({
    description: "잘못된 게시글 아이디",
  })
  @ApiOkResponse({
    description: "게시글 읽기 성공",
    type: PostWithAroundInfoDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get(":boardType/:postId")
  async readPost(@Param() { postId, boardType }: PostIdentifierParamDto) {
    return this.queryBus.execute(new ReadPostQuery({ boardType, postId }));
  }

  @ApiOperation({
    summary: "게시글 수정",
  })
  @ApiBody({
    type: ModifyPostRequestDto,
  })
  @ApiNotFoundResponse({
    description: "잘못된 게시글 아이디",
  })
  @ApiOkResponse({
    description: "게시글 수정 성공",
    type: PostInfoDto,
  })
  @UseGuards(VerifiedUserGuard)
  @HttpCode(HttpStatus.OK)
  @Patch(":boardType/:postId")
  async modifyPost(
    @Param() { postId, boardType }: PostIdentifierParamDto,
    @Body() body: ModifyPostRequestDto,
    @LoginUser() user: User,
  ) {
    const post = await this.postsService.modifyPost(
      user,
      { boardType, postId },
      body,
    );
    return PostInfoDto.fromModel(post);
  }

  @ApiOperation({
    summary: "게시글 삭제",
  })
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
    @Param() { postId, boardType }: PostIdentifierParamDto,
    @LoginUser() user: User,
  ) {
    await this.postsService.deletePost(user, { boardType, postId });
  }
}
