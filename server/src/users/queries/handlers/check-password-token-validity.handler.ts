import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { CheckPasswordTokenValidityQuery } from "../check-password-token-validity.query";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { User } from "../../../entities/user.entity";
import { orThrowNotFoundUser } from "../../../common/utils/or-throw";

@QueryHandler(CheckPasswordTokenValidityQuery)
export class CheckPasswordTokenValidityHandler
  implements IQueryHandler<CheckPasswordTokenValidityQuery, void>
{
  @Transaction()
  async execute(
    query: CheckPasswordTokenValidityQuery,
    @TransactionManager() tm?: EntityManager,
  ): Promise<void> {
    const em = tm!;
    const { verifyToken, email } = query;
    const user = await em
      .findOneOrFail(User, { where: { email } })
      .catch(orThrowNotFoundUser);
    user.verifyPasswordResetToken(verifyToken);
  }
}
