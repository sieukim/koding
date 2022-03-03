import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SetAdminCommand } from "../set-admin.command";
import { Role } from "../../../entities/role.enum";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { User } from "../../../entities/user.entity";
import { orThrowNotFoundUser } from "src/common/utils/or-throw";

@CommandHandler(SetAdminCommand)
export class SetAdminHandler implements ICommandHandler<SetAdminCommand> {
  @Transaction()
  async execute(
    command: SetAdminCommand,
    @TransactionManager() tm?: EntityManager,
  ) {
    const em = tm!;
    const { nickname } = command;
    const user = await em
      .findOneOrFail(User, { where: { nickname } })
      .catch(orThrowNotFoundUser);
    if (!user.roles.includes(Role.Admin)) user.roles.push(Role.Admin);
    await em.save(user, { reload: false });
    return user;
  }
}
