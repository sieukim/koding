import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { DeleteAvatarCommand } from "../delete-avatar.command";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { User } from "../../../entities/user.entity";
import { orThrowNotFoundUser } from "src/common/utils/or-throw";

@CommandHandler(DeleteAvatarCommand)
export class DeleteAvatarHandler
  implements ICommandHandler<DeleteAvatarCommand>
{
  constructor(private readonly publisher: EventPublisher) {}

  @Transaction()
  async execute(
    command: DeleteAvatarCommand,
    @TransactionManager() tm?: EntityManager,
  ) {
    const em = tm!;
    const { nickname } = command;
    const user = this.publisher.mergeObjectContext(
      await em
        .findOneOrFail(User, { where: { nickname }, loadEagerRelations: false })
        .catch(orThrowNotFoundUser),
    );
    user.deleteAvatar();
    await em.save(User, user, { reload: false });
    user.commit();
    return;
  }
}
