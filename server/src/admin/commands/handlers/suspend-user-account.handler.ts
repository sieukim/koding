import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SuspendUserAccountCommand } from "../suspend-user-account.command";
import { User } from "../../../entities/user.entity";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { orThrowNotFoundUser } from "../../../common/utils/or-throw";

@CommandHandler(SuspendUserAccountCommand)
export class SuspendUserAccountHandler
  implements ICommandHandler<SuspendUserAccountCommand>
{
  @Transaction()
  async execute(
    command: SuspendUserAccountCommand,
    @TransactionManager() tm?: EntityManager,
  ): Promise<User> {
    const em = tm!;
    const { nickname, suspendDay, forever } = command;
    const user = await em
      .findOneOrFail(User, { where: { nickname } })
      .catch(orThrowNotFoundUser);
    user.suspendAccount(forever, suspendDay);
    await em.save(user, { reload: false });
    return user;
  }
}
