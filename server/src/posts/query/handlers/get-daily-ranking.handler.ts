import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetDailyRankingQuery } from "../get-daily-ranking.query";
import { PostRankingService } from "../../services/post-ranking.service";
import { PostListDto } from "../../dto/post-list.dto";

@QueryHandler(GetDailyRankingQuery)
export class GetDailyRankingHandler
  implements IQueryHandler<GetDailyRankingQuery>
{
  constructor(private readonly postRankingService: PostRankingService) {}

  async execute(query: GetDailyRankingQuery): Promise<any> {
    const { pageSize, boardType } = query;
    const [posts, totalCount] = await Promise.all([
      this.postRankingService.getDailyRanking(boardType, pageSize),
      this.postRankingService.getDailyRankingCount(boardType),
    ]);
    return PostListDto.fromModel(posts, totalCount);
  }
}
