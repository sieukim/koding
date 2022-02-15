import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from "@nestjs/common";
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { BoardTypeParamDto } from "./dto/param/board-type-param.dto";
import { QueryBus } from "@nestjs/cqrs";
import { GetDailyRankingQuery } from "./query/get-daily-ranking.query";
import { PageSizeQueryDto } from "../common/dto/query/page-size-query.dto";
import { PostListDto } from "./dto/post-list.dto";

@ApiTags("POST/RANKING")
@ApiBadRequestResponse({
  description: "param, query, body 중 유효하지 않은 요청값이 존재",
})
@Controller("api/post-ranking")
export class PostRankingController {
  constructor(private readonly queryBus: QueryBus) {}

  /*
   * 게시판별 일일 게시글 랭킹
   */
  @ApiOkResponse({
    type: PostListDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get("daily/:boardType")
  getDailyRanking(
    @Param() { boardType }: BoardTypeParamDto,
    @Query() { pageSize }: PageSizeQueryDto,
  ) {
    return this.queryBus.execute(new GetDailyRankingQuery(boardType, pageSize));
  }
}
