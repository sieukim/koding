import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
} from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { isEmpty } from "class-validator";
import { QueryBus } from "@nestjs/cqrs";
import { UnifiedSearchPostQuery } from "./queries/unified-search-post.query";
import { UnifiedSearchPostsResultDto } from "./dto/unified-search-posts-result.dto";
import { NicknameSearchResultDto } from "./dto/nickname-search-result.dto";
import { SearchNicknameQueryDto } from "./dto/query/search-nickname-query.dto";
import { SearchNicknameQuery } from "./queries/search-nickname.query";
import { UnifiedSearchPostQueryDto } from "./dto/query/unified-search-post-query.dto";

@ApiTags("SEARCH")
@Controller("api/search")
export class SearchController {
  constructor(private readonly queryBus: QueryBus) {}

  @ApiOperation({
    summary: "게시글 통합 요약 검색",
  })
  @ApiOkResponse({
    description: "통합 검색 성공",
    type: UnifiedSearchPostsResultDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get("posts")
  unifiedSearch(@Query() { query, sort, tags }: UnifiedSearchPostQueryDto) {
    const postsPerBoard = 5;
    if (isEmpty(query)) throw new BadRequestException("query가 비어있습니다.");
    return this.queryBus.execute(
      new UnifiedSearchPostQuery(query, tags, sort, postsPerBoard),
    );
  }

  // @ApiOperation({
  //   summary: "게시글 검색",
  // })
  // @ApiOkResponse({
  //   description: "게시글 검색 성공",
  //   type: PostListWithCursorDto,
  // })
  // @Get("posts/:boardType")
  // async searchPosts(
  //   @Param() { boardType }: BoardTypeParamDto,
  //   @Query() { cursor, query, pageSize, sort, tags }: SearchPostQueryDto,
  // ) {
  //   return this.queryBus.execute(
  //     new SearchPostQuery(boardType, query, tags, sort, pageSize, cursor),
  //   );
  // }

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
