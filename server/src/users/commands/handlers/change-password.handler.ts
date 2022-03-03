import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ChangePasswordCommand } from "../change-password.command";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { User } from "../../../entities/user.entity";
import { orThrowNotFoundUser } from "../../../common/utils/or-throw";

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordHandler
  implements ICommandHandler<ChangePasswordCommand, void>
{
  @Transaction()
  async execute(
    command: ChangePasswordCommand,
    @TransactionManager() tm?: EntityManager,
  ): Promise<void> {
    const em = tm!;
    const { newPassword, currentPassword, nickname } = command;
    const user = await em
      .findOneOrFail(User, { where: { nickname }, loadEagerRelations: false })
      .catch(orThrowNotFoundUser);
    await user.changePassword(currentPassword, newPassword);
    await em.save(user, { reload: false });
  }
}
