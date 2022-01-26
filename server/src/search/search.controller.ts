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
import { ApiParamBoardType } from "../common/decorator/swagger/api-param.decorator";
import { PostListDto } from "../posts/dto/post-list.dto";
import { BoardTypeValidationPipe } from "../common/pipes/board-type-validation-pipe";
import { PostBoardType } from "../models/post.model";
import { SearchPostQuery } from "./queries/search-post.query";
import { SearchPostQueryDto } from "./dto/query/search-post-query.dto";

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
    description: "톰합검색할 검색어",
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
  @ApiParamBoardType()
  @ApiQuery({
    name: "cursor",
    description:
      "조회를 시작할 기준이 되는 커서. 첫 페이지를 조회하는 경우에는 값을 넣지 않음",
    type: String,
    required: false,
  })
  @ApiQuery({
    name: "query",
    description: "검색할 검색어",
    type: String,
  })
  @ApiOkResponse({
    description: "게시글 검색 성공",
    type: PostListDto,
  })
  @Get(":boardType")
  async searchPosts(
    @Param("boardType", BoardTypeValidationPipe) boardType: PostBoardType,
    @Query() { cursor, query }: SearchPostQueryDto,
  ) {
    const pageSize = 10;
    return this.queryBus.execute(
      new SearchPostQuery(query, boardType, pageSize, cursor),
    );
  }
}
