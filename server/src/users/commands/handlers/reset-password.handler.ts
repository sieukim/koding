import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ResetPasswordCommand } from "../reset-password.command";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { User } from "../../../entities/user.entity";
import { orThrowNotFoundUser } from "src/common/utils/or-throw";

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler
  implements ICommandHandler<ResetPasswordCommand, void>
{
  @Transaction()
  async execute(
    command: ResetPasswordCommand,
    @TransactionManager() tm?: EntityManager,
  ): Promise<void> {
    const em = tm!;
    const { newPassword, email, verifyToken } = command;
    const user = await em
      .findOneOrFail(User, { where: { email }, loadEagerRelations: false })
      .catch(orThrowNotFoundUser);
    await user.resetPassword({ verifyToken, newPassword });
    await em.save(user, { reload: false });
  }
}
