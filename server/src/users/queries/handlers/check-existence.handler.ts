import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { CheckExistenceQuery } from "../check-existence.query";
import { BadRequestException } from "@nestjs/common";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { User } from "../../../entities/user.entity";

@QueryHandler(CheckExistenceQuery)
export class CheckExistenceHandler
  implements IQueryHandler<CheckExistenceQuery>
{
  @Transaction()
  async execute(
    query: CheckExistenceQuery,
    @TransactionManager() tm?: EntityManager,
  ): Promise<boolean> {
    const em = tm!;
    const { key, value } = query;
    let user: User | undefined;
    switch (key) {
      case "nickname":
        user = await em.findOne(User, {
          where: { nickname: value },
          select: ["nickname"],
          loadEagerRelations: false,
        });
        break;
      case "email":
        user = await em.findOne(User, {
          where: { email: value },
          select: ["nickname"],
          loadEagerRelations: false,
        });
        break;
      default:
        throw new BadRequestException("잘못된 key 값입니다");
    }
    if (user) return true;
    return false;
  }
}
