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
import { SearchPostResultWithCursorDto } from "./dto/search-post-result-with-cursor.dto";
import { BoardTypeParamDto } from "../posts/dto/param/board-type-param.dto";

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
  @ApiQuery({
    name: "query",
    description: "검색할 검색어",
    type: String,
  })
  @ApiOkResponse({
    description: "게시글 검색 성공",
    type: SearchPostResultWithCursorDto,
  })
  @Get(":boardType")
  async searchPosts(
    @Param() { boardType }: BoardTypeParamDto,
    @Query() { cursor, query, pageSize }: SearchPostQueryDto,
  ) {
    return this.queryBus.execute(
      new SearchPostQuery(query, boardType, pageSize, cursor),
    );
  }
}
