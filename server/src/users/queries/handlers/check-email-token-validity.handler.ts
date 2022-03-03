import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { CheckEmailTokenValidityQuery } from "../check-email-token-validity.query";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { EmailVerifyToken } from "../../../entities/email-verify-token.entity";
import { BadRequestException } from "@nestjs/common";

@QueryHandler(CheckEmailTokenValidityQuery)
export class CheckEmailTokenValidityHandler
  implements IQueryHandler<CheckEmailTokenValidityQuery>
{
  @Transaction()
  async execute(
    query: CheckEmailTokenValidityQuery,
    @TransactionManager() tm?: EntityManager,
  ) {
    const em = tm!;
    const { verifyToken, email } = query;
    const emailToken = await em
      .findOneOrFail(EmailVerifyToken, {
        where: { email },
      })
      .catch(() => {
        throw new BadRequestException("잘못된 토큰");
      });
    emailToken.verify(verifyToken);
  }
}
