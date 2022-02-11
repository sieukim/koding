import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from "@nestjs/common";
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { isEmpty } from "class-validator";
import { QueryBus } from "@nestjs/cqrs";
import { UnifiedSearchPostQuery } from "./queries/unified-search-post.query";
import { UnifiedSearchPostsResultDto } from "./dto/unified-search-posts-result.dto";
import { SearchPostQuery } from "./queries/search-post.query";
import { SearchPostQueryDto } from "./dto/query/search-post-query.dto";
import { BoardTypeParamDto } from "../posts/dto/param/board-type-param.dto";
import { PostListWithCursorDto } from "../posts/dto/post-list-with-cursor.dto";
import { NicknameSearchResultDto } from "./dto/nickname-search-result.dto";
import { SearchNicknameQueryDto } from "./dto/query/search-nickname-query.dto";
import { SearchNicknameQuery } from "./queries/search-nickname.query";

@ApiTags("SEARCH")
@Controller("api/search")
export class SearchController {
  constructor(private readonly queryBus: QueryBus) {}

  @ApiOperation({
    summary: "게시글 통합 요약 검색",
  })
  @ApiQuery({
    name: "query",
    type: String,
    description: "통합 검색할 검색어",
  })
  @ApiOkResponse({
    description: "통합 검색 성공",
    type: UnifiedSearchPostsResultDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get("posts")
  unifiedSearch(@Query("query") query: string) {
    const postsPerBoard = 5;
    if (isEmpty(query)) throw new BadRequestException("query가 비어있습니다.");
    return this.queryBus.execute(
      new UnifiedSearchPostQuery(query, postsPerBoard),
    );
  }

  @ApiOperation({
    summary: "게시글 검색",
  })
  @ApiOkResponse({
    description: "게시글 검색 성공",
    type: PostListWithCursorDto,
  })
  @Get("posts/:boardType")
  async searchPosts(
    @Param() { boardType }: BoardTypeParamDto,
    @Query() { cursor, query, pageSize }: SearchPostQueryDto,
  ) {
    return this.queryBus.execute(
      new SearchPostQuery(query, boardType, pageSize, cursor),
    );
  }

  @ApiOperation({
    summary: "사용자 닉네임 검색",
  })
  @ApiOkResponse({
    description: "닉네임 검색 성공",
    type: NicknameSearchResultDto,
  })
  @Get("users")
  async searchNicknames(
    @Query() { cursor, nickname, pageSize }: SearchNicknameQueryDto,
  ) {
    return this.queryBus.execute(
      new SearchNicknameQuery(nickname, pageSize, cursor),
    );
  }
}
