import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetDailyRankingQuery } from "../get-daily-ranking.query";
import { PostListDto } from "../../dto/post-list.dto";
import {
  EntityManager,
  MoreThan,
  Transaction,
  TransactionManager,
} from "typeorm";
import { getCurrentDate } from "../../../common/utils/time.util";
import { PostDailyRanking } from "../../../entities/post-daily-ranking.entity";

@QueryHandler(GetDailyRankingQuery)
export class GetDailyRankingHandler
  implements IQueryHandler<GetDailyRankingQuery>
{
  @Transaction()
  async execute(
    query: GetDailyRankingQuery,
    @TransactionManager() tm?: EntityManager,
  ) {
    const em = tm!;
    const { pageSize, boardType } = query;
    const currentDate = getCurrentDate();
    const [posts, totalCount] = await Promise.all([
      em
        .createQueryBuilder(PostDailyRanking, "ranking")
        .where("ranking.aggregateDate = :currentDate", { currentDate })
        .andWhere("(ranking.boardType = :boardType)", { boardType })
        .andWhere("(ranking.popularity > 0)")
        .innerJoinAndSelect("ranking.post", "post")
        .innerJoinAndSelect("post.writer", "writer")
        .orderBy("ranking.popularity", "DESC")
        .addOrderBy("post.createdAt", "DESC")
        .limit(pageSize)
        .getMany()
        .then((rankings) => rankings.map((ranking) => ranking.post!)),
      em.count(PostDailyRanking, {
        where: {
          aggregateDate: currentDate,
          boardType,
          popularity: MoreThan(0),
        },
      }),
    ]);
    return PostListDto.fromModel(posts, totalCount);
  }
}
