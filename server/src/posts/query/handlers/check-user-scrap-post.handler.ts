import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { CheckUserScrapPostQuery } from "../check-user-scrap-post.query";
import { UserScrapPostInfoDto } from "../../dto/user-scrap-post-info.dto";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { PostScrap } from "../../../entities/post-scrap.entity";

@QueryHandler(CheckUserScrapPostQuery)
export class CheckUserScrapPostHandler
  implements IQueryHandler<CheckUserScrapPostQuery>
{
  @Transaction()
  async execute(
    query: CheckUserScrapPostQuery,
    @TransactionManager() tm?: EntityManager,
  ) {
    const em = tm!;
    const {
      postIdentifier: { postId, boardType },
      nickname,
    } = query;
    const isUserScrapped = await em
      .findOne(PostScrap, { where: { postId, nickname } })
      .then((postScrap) => !!postScrap);
    return new UserScrapPostInfoDto(
      { postId, boardType },
      nickname,
      isUserScrapped,
    );
  }
}
