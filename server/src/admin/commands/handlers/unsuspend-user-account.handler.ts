import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UnsuspendUserAccountCommand } from "../unsuspend-user-account.command";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { User } from "../../../entities/user.entity";
import { orThrowNotFoundUser } from "../../../common/utils/or-throw";

@CommandHandler(UnsuspendUserAccountCommand)
export class UnsuspendUserAccountHandler
  implements ICommandHandler<UnsuspendUserAccountCommand>
{
  @Transaction()
  async execute(
    command: UnsuspendUserAccountCommand,
    @TransactionManager() tm?: EntityManager,
  ) {
    const em = tm!;
    const { nickname } = command;
    const user = await em
      .findOneOrFail(User, { where: { nickname } })
      .catch(orThrowNotFoundUser);
    user.unsuspendUserAccount();
    await em.save(user, { reload: false });
    return user;
  }
}
