import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetFollowerUsersQuery } from "../get-follower-users.query";
import { FollowerUsersInfoDto } from "../../dto/follower-users-info.dto";
import { User } from "../../../entities/user.entity";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { orThrowNotFoundUser } from "../../../common/utils/or-throw";

@QueryHandler(GetFollowerUsersQuery)
export class GetFollowerUsersHandler
  implements IQueryHandler<GetFollowerUsersQuery, FollowerUsersInfoDto>
{
  @Transaction()
  async execute(
    query: GetFollowerUsersQuery,
    @TransactionManager() tm?: EntityManager,
  ): Promise<FollowerUsersInfoDto> {
    const em = tm!;
    const { nickname } = query;

    const user = (await em
      .findOneOrFail(User, {
        where: { nickname },
        relations: ["followerUsers"],
      })
      .catch(orThrowNotFoundUser)) as User & { followerUsers: User[] };
    return new FollowerUsersInfoDto(user.followerUsers);
  }
}
