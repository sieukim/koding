import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { CheckFollowingQuery } from "../check-following.query";
import { NotFoundException } from "@nestjs/common";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { orThrowNotFoundUser } from "../../../common/utils/or-throw";
import { User } from "../../../entities/user.entity";
import { Follow } from "../../../entities/follow.entity";

@QueryHandler(CheckFollowingQuery)
export class CheckFollowingHandler
  implements IQueryHandler<CheckFollowingQuery>
{
  @Transaction()
  async execute(
    query: CheckFollowingQuery,
    @TransactionManager() tm?: EntityManager,
  ) {
    const em = tm!;
    const { fromNickname, toNickname } = query;
    const user = (await em
      .createQueryBuilder(User, "user")
      .where("user.nickname = :fromNickname", { fromNickname })
      .leftJoinAndSelect(
        "user.followings",
        "followings",
        "followings.toNickname = :toNickname",
        { toNickname },
      )
      .getOneOrFail()
      .catch(orThrowNotFoundUser)) as User & { followings: Follow[] };
    if (user.followings.some((nickname) => nickname.toNickname === toNickname))
      return;
    else throw new NotFoundException("팔로우중이지 않습니다");
  }
}
