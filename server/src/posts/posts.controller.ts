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
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { GetPostListQuery } from "./query/get-post-list.query";
import { ReadPostQuery } from "./query/read-post.query";
import { BoardTypeParamDto } from "./dto/param/board-type-param.dto";
import { PostIdentifierParamDto } from "./dto/param/post-identifier-param.dto";
import { WritePostCommand } from "./commands/write-post.command";
import { WritePostHandler } from "./commands/handlers/write-post.handler";
import { ModifyPostCommand } from "./commands/modify-post.command";
import { ModifyPostHandler } from "./commands/handlers/modify-post.handler";
import { DeletePostCommand } from "./commands/delete-post.command";
import { PostIdentifierWithNicknameParamDto } from "./dto/param/post-identifier-with-nickname-param.dto";
import { PostLikeCountInfoDto } from "./dto/post-like-count-info.dto";
import { ParamNicknameSameUserGuard } from "../auth/guard/authorization/param-nickname-same-user.guard";
import { LikePostCommand } from "./commands/like-post.command";
import { LikePostHandler } from "./commands/handlers/like-post.handler";
import { UnlikePostCommand } from "./commands/unlike-post.command";
import { UnlikePostHandler } from "./commands/handlers/unlike-post.handler";
import { UserLikePostInfoDto } from "./dto/user-like-post-info.dto";
import { CheckUserLikePostQuery } from "./query/check-user-like-post.query";

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
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
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
    const post = (await this.commandBus.execute(
      new WritePostCommand(boardType, user.nickname, body),
    )) as Awaited<ReturnType<WritePostHandler["execute"]>>;
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
  async readPost(
    @Param() { postId, boardType }: PostIdentifierParamDto,
    @LoginUser() loginUser: User,
  ) {
    return this.queryBus.execute(
      new ReadPostQuery({ boardType, postId }, loginUser?.nickname),
    );
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
    const post = (await this.commandBus.execute(
      new ModifyPostCommand(user.nickname, { postId, boardType }, body),
    )) as Awaited<ReturnType<ModifyPostHandler["execute"]>>;
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
    await this.commandBus.execute(
      new DeletePostCommand(user.nickname, { postId, boardType }),
    );
  }

  /*
   * 좋아요 요청
   * @description 이미 좋아요를 눌렀던 경우에도 API는 정상적으로 200 OK를 반환
   */
  @ApiOkResponse({
    description: "좋아요 요청 성공(이미 좋아요를 누른 경우도 포함)",
    type: PostLikeCountInfoDto,
  })
  @UseGuards(VerifiedUserGuard, ParamNicknameSameUserGuard)
  @HttpCode(HttpStatus.OK)
  @Post(":boardType/:postId/like/:nickname")
  async likePost(
    @Param()
    { postId, boardType, nickname }: PostIdentifierWithNicknameParamDto,
  ) {
    const likeCount = (await this.commandBus.execute(
      new LikePostCommand({ postId, boardType }, nickname),
    )) as Awaited<ReturnType<LikePostHandler["execute"]>>;
    return new PostLikeCountInfoDto({ postId, boardType }, likeCount);
  }

  /*
   * 좋아요 취소 요청
   * @description 이미 좋아요를 하지 않았던 경우에도 API는 정상적으로 200 OK를 반환
   */
  @ApiOkResponse({
    description: "좋아요 취소 성공(이미 좋아요를 하지 않았던 경우도 포함)",
    type: PostLikeCountInfoDto,
  })
  @UseGuards(VerifiedUserGuard, ParamNicknameSameUserGuard)
  @HttpCode(HttpStatus.OK)
  @Delete(":boardType/:postId/like/:nickname")
  async unlikePost(
    @Param()
    { postId, boardType, nickname }: PostIdentifierWithNicknameParamDto,
  ) {
    const likeCount = (await this.commandBus.execute(
      new UnlikePostCommand({ postId, boardType }, nickname),
    )) as Awaited<ReturnType<UnlikePostHandler["execute"]>>;
    return new PostLikeCountInfoDto({ postId, boardType }, likeCount);
  }

  /*
   * 게시글에 대한 사용자의 좋아요 여부 조회
   */
  @ApiOkResponse({
    description: "게시글에 대한 사용자의 좋아요 여부 조회 성공",
    type: UserLikePostInfoDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get(":boardType/:postId/like/:nickname")
  async likedPost(
    @Param()
    { postId, boardType, nickname }: PostIdentifierWithNicknameParamDto,
  ) {
    return this.queryBus.execute(
      new CheckUserLikePostQuery({ postId, boardType }, nickname),
    );
  }
}
