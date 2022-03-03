import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetFollowingUsersQuery } from "../get-following-users.query";
import { FollowingUsersInfoDto } from "../../dto/following-users-info.dto";
import { User } from "../../../entities/user.entity";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { orThrowNotFoundUser } from "../../../common/utils/or-throw";

@QueryHandler(GetFollowingUsersQuery)
export class GetFollowingUsersHandler
  implements IQueryHandler<GetFollowingUsersQuery, FollowingUsersInfoDto>
{
  @Transaction()
  async execute(
    query: GetFollowingUsersQuery,
    @TransactionManager() tm?: EntityManager,
  ): Promise<FollowingUsersInfoDto> {
    const em = tm!;
    const { nickname } = query;
    const user = (await em
      .findOneOrFail(User, {
        where: { nickname },
        relations: ["followingUsers"],
      })
      .catch(orThrowNotFoundUser)) as User & { followingUsers: User[] };
    return new FollowingUsersInfoDto(user.followingUsers);
  }
}
