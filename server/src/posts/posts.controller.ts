import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
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
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from "@nestjs/swagger";
import { VerifiedUserGuard } from "../auth/guard/authorization/verified-user.guard";
import { LoginUser } from "../common/decorator/login-user.decorator";
import { ModifyPostRequestDto } from "./dto/modify-post-request.dto";

import { PostListWithCursorDto } from "./dto/post-list-with-cursor.dto";
import { PostWithAroundInfoDto } from "./dto/post-with-around-info.dto";
import { User } from "../models/user.model";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ReadPostQuery } from "./query/read-post.query";
import { BoardTypeParamDto } from "./dto/param/board-type-param.dto";
import { PostIdentifierParamDto } from "./dto/param/post-identifier-param.dto";
import { WritePostCommand } from "./commands/write-post.command";
import { WritePostHandler } from "./commands/handlers/write-post.handler";
import { ModifyPostCommand } from "./commands/modify-post.command";
import { ModifyPostHandler } from "./commands/handlers/modify-post.handler";
import { DeletePostCommand } from "./commands/delete-post.command";
import { PostIdentifierWithNicknameParamDto } from "./dto/param/post-identifier-with-nickname-param.dto";
import { ParamNicknameSameUserGuard } from "../auth/guard/authorization/param-nickname-same-user.guard";
import { LikePostCommand } from "./commands/like-post.command";
import { UnlikePostCommand } from "./commands/unlike-post.command";
import { UserLikePostInfoDto } from "./dto/user-like-post-info.dto";
import { CheckUserLikePostQuery } from "./query/check-user-like-post.query";
import { ScrapPostCommand } from "../users/commands/scrap-post.command";
import { UnscrapPostCommand } from "../users/commands/unscrap-post.command";
import { CheckUserScrapPostQuery } from "./query/check-user-scrap-post.query";
import { UserScrapPostInfoDto } from "./dto/user-scrap-post-info.dto";
import { ReportPostCommand } from "./commands/report-post.command";
import { ReportPostRequestDto } from "./dto/report-post-request.dto";
import { SearchPostQuery } from "../search/queries/search-post.query";
import { SearchPostQueryDto } from "../search/dto/query/search-post-query.dto";
import { RealIp } from "nestjs-real-ip";

@ApiTags("POST")
@ApiBadRequestResponse({
  description: "param, query, body 중 유효하지 않은 요청값이 존재",
})
@ApiForbiddenResponse({
  description: "인증되지 않은 사용자이거나 권한 없음",
})
@Controller("api/posts")
export class PostsController {
  private readonly logger = new Logger(PostsController.name);

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
    summary: "게시글 목록 조회 & 검색",
    description:
      "query 와 tags 를 지정하지 않는다면 게시글 목록 조회. 둘 중 하나라도 지정할 경우 해당 조건으로 검색",
  })
  @ApiServiceUnavailableResponse({
    description: "검색엔진이 아직 초기화중인 경우",
  })
  @ApiOkResponse({
    description: "게시글 조회 성공",
    type: PostListWithCursorDto,
  })
  @Get(":boardType")
  async readPosts(
    @Param() { boardType }: BoardTypeParamDto,
    @Query() { cursor, query, pageSize, sort, tags }: SearchPostQueryDto,
  ) {
    return this.queryBus.execute(
      new SearchPostQuery(boardType, query, tags, sort, pageSize, cursor),
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
    @RealIp() ip: string,
  ) {
    this.logger.log(`readPost: ip ${ip}, postId:${postId}`);
    return this.queryBus.execute(
      new ReadPostQuery({ boardType, postId }, ip, loginUser?.nickname),
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
   * 게시글 좋아요 요청
   * @description 이미 좋아요를 눌렀던 경우에도 API 는 정상적으로 204 NO CONTENT 를 반환
   */
  @ApiNoContentResponse({
    description: "좋아요 요청 성공(이미 좋아요를 누른 경우도 포함)",
  })
  @UseGuards(ParamNicknameSameUserGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(":boardType/:postId/like/:nickname")
  async likePost(
    @Param()
    { postId, boardType, nickname }: PostIdentifierWithNicknameParamDto,
  ) {
    await this.commandBus.execute(
      new LikePostCommand({ postId, boardType }, nickname),
    );
    return;
  }

  /*
   * 게시글 좋아요 취소 요청
   * @description 이미 좋아요를 하지 않았던 경우에도 API 는 정상적으로 204 NO CONTENT 를 반환
   */
  @ApiNoContentResponse({
    description: "좋아요 취소 성공(이미 좋아요를 하지 않았던 경우도 포함)",
  })
  @UseGuards(ParamNicknameSameUserGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":boardType/:postId/like/:nickname")
  async unlikePost(
    @Param()
    { postId, boardType, nickname }: PostIdentifierWithNicknameParamDto,
  ) {
    await this.commandBus.execute(
      new UnlikePostCommand({ postId, boardType }, nickname),
    );
    return;
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
  async isUserLikedPost(
    @Param()
    { postId, boardType, nickname }: PostIdentifierWithNicknameParamDto,
  ) {
    return this.queryBus.execute(
      new CheckUserLikePostQuery({ postId, boardType }, nickname),
    );
  }

  /*
   * 게시글 스크랩
   * @description 이미 스크랩을 했던 경우에도 API 는 정상적으로 204 NO CONTENT 를 반환
   */
  @ApiNoContentResponse({
    description: "게시글 스크랩 성공(이미 스크랩 하고 있던 경우도 포함)",
  })
  @UseGuards(ParamNicknameSameUserGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(":boardType/:postId/scrap/:nickname")
  async scrapPost(
    @Param()
    { nickname, boardType, postId }: PostIdentifierWithNicknameParamDto,
  ) {
    await this.commandBus.execute(
      new ScrapPostCommand({ postId, boardType }, nickname),
    );
    return;
  }

  /*
   * 게시글 스크랩 취소
   * @description 이미 스크랩하지 않았던 경우에도 API 는 정상적으로 204 NO CONTENT 를 반환
   */
  @ApiNoContentResponse({
    description:
      "게시글 스크랩 취소 성공(이미 스크랩하지 않고 있던 경우도 포함)",
  })
  @UseGuards(ParamNicknameSameUserGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":boardType/:postId/scrap/:nickname")
  async unscrapPost(
    @Param()
    { nickname, boardType, postId }: PostIdentifierWithNicknameParamDto,
  ) {
    await this.commandBus.execute(
      new UnscrapPostCommand({ postId, boardType }, nickname),
    );
    return;
  }

  /*
   * 게시글에 대한 사용자의 스크랩 여부 조회
   */
  @ApiOkResponse({
    description: "게시글에 대한 사용자의 스크랩 여부 조회 성공",
    type: UserScrapPostInfoDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get(":boardType/:postId/like/:nickname")
  async isUserScrappedPost(
    @Param()
    { postId, boardType, nickname }: PostIdentifierWithNicknameParamDto,
  ) {
    return this.queryBus.execute(
      new CheckUserScrapPostQuery({ postId, boardType }, nickname),
    );
  }

  /*
   * 게시글 신고
   */
  @ApiNoContentResponse({
    description: "게시글 신고 성공",
  })
  @ApiConflictResponse({
    description: "이미 신고한 게시글",
  })
  @UseGuards(ParamNicknameSameUserGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(":boardType/:postId/report/:nickname")
  async reportPost(
    @Param()
    { nickname, boardType, postId }: PostIdentifierWithNicknameParamDto,
    @Body() { reportReason }: ReportPostRequestDto,
  ) {
    await this.commandBus.execute(
      new ReportPostCommand({ postId, boardType }, nickname, reportReason),
    );
    return;
  }
}
