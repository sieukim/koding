import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetUserInfoQuery } from "../get-user-info.query";
import { UserInfoDto } from "../../dto/user-info.dto";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { User } from "../../../entities/user.entity";
import { orThrowNotFoundUser } from "src/common/utils/or-throw";

@QueryHandler(GetUserInfoQuery)
export class GetUserInfoHandler
  implements IQueryHandler<GetUserInfoQuery, UserInfoDto>
{
  @Transaction()
  async execute(
    query: GetUserInfoQuery,
    @TransactionManager() tm?: EntityManager,
  ): Promise<UserInfoDto> {
    const em = tm!;
    const { nickname } = query;
    const user = await em
      .findOneOrFail(User, { where: { nickname } })
      .catch(orThrowNotFoundUser);
    return UserInfoDto.fromModel(user);
  }
}
