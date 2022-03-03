import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { ChangeProfileCommand } from "../change-profile.command";
import { User } from "../../../entities/user.entity";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { orThrowNotFoundUser } from "../../../common/utils/or-throw";

@CommandHandler(ChangeProfileCommand)
export class ChangeProfileHandler
  implements ICommandHandler<ChangeProfileCommand, User>
{
  constructor(private readonly publisher: EventPublisher) {}

  @Transaction()
  async execute(
    command: ChangeProfileCommand,
    @TransactionManager() tm?: EntityManager,
  ): Promise<User> {
    const em = tm!;
    const { nickname, request } = command;
    const user = this.publisher.mergeObjectContext(
      await em
        .findOneOrFail(User, { where: { nickname } })
        .catch(orThrowNotFoundUser),
    );
    user.changeProfile(request);
    await em.save(User, user, { reload: false });
    user.commit();
    return user;
  }
}
