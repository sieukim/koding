import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetDailyRankingQuery } from "../get-daily-ranking.query";
import { PostRankingService } from "../../services/post-ranking.service";

@QueryHandler(GetDailyRankingQuery)
export class GetDailyRankingHandler
  implements IQueryHandler<GetDailyRankingQuery>
{
  constructor(private readonly postRankingService: PostRankingService) {}

  async execute(query: GetDailyRankingQuery): Promise<any> {
    const { pageSize, boardType } = query;
    return this.postRankingService.getDailyRanking(boardType, pageSize);
  }
}
