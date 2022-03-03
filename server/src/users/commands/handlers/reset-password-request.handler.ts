import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { ResetPasswordRequestCommand } from "../reset-password-request.command";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { User } from "../../../entities/user.entity";
import { orThrowNotFoundUser } from "../../../common/utils/or-throw";

@CommandHandler(ResetPasswordRequestCommand)
export class ResetPasswordRequestHandler
  implements ICommandHandler<ResetPasswordRequestCommand, void>
{
  constructor(private readonly publisher: EventPublisher) {}

  @Transaction()
  async execute(
    command: ResetPasswordRequestCommand,
    @TransactionManager() tm?: EntityManager,
  ): Promise<void> {
    const em = tm!;
    const { email } = command;
    const user = this.publisher.mergeObjectContext(
      await em
        .findOneOrFail(User, { where: { email } })
        .catch(orThrowNotFoundUser),
    );
    user.sendPasswordResetEmail();
    await em.save(User, user, { reload: false });
    user.commit();
  }
}
