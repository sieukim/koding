import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetMyUserInfoQuery } from "../get-my-user-info.query";
import { MyUserInfoDto } from "../../dto/my-user-info.dto";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { User } from "../../../entities/user.entity";
import { orThrowNotFoundUser } from "src/common/utils/or-throw";

@QueryHandler(GetMyUserInfoQuery)
export class GetMyUserInfoHandler
  implements IQueryHandler<GetMyUserInfoQuery, MyUserInfoDto>
{
  @Transaction()
  async execute(
    query: GetMyUserInfoQuery,
    @TransactionManager() tm?: EntityManager,
  ): Promise<MyUserInfoDto> {
    const em = tm!;
    const { myNickname } = query;
    const me = await em
      .findOneOrFail(User, { where: { nickname: myNickname } })
      .catch(orThrowNotFoundUser);
    return MyUserInfoDto.fromModel(me);
  }
}
