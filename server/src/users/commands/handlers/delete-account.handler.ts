import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { DeleteAccountCommand } from "../delete-account.command";
import { UserDeletedEvent } from "../../events/user-deleted.event";
import { ProfileAvatarChangedEvent } from "../../../upload/event/profile-avatar-changed.event";
import { EntityManager, In, Transaction, TransactionManager } from "typeorm";
import { User } from "../../../entities/user.entity";
import { orThrowNotFoundUser } from "../../../common/utils/or-throw";
import { increaseField } from "../../../common/utils/increase-field";
import { Fetched } from "../../../common/types/fetched.type";

@CommandHandler(DeleteAccountCommand)
export class DeleteAccountHandler
  implements ICommandHandler<DeleteAccountCommand>
{
  constructor(private readonly eventBus: EventBus) {}

  @Transaction()
  async execute(
    command: DeleteAccountCommand,
    @TransactionManager() tm?: EntityManager,
  ): Promise<void> {
    const em = tm!;
    const { nickname } = command;
    const user = (await em
      .findOneOrFail(User, {
        where: { nickname },
        relations: ["followings", "followers"],
      })
      .catch(orThrowNotFoundUser)) as Fetched<User, "followings" | "followers">;
    await Promise.all([
      increaseField(em, User, "followersCount", -1, {
        nickname: In(user.followings.map((f) => f.toNickname)),
      }),
      increaseField(em, User, "followingsCount", -1, {
        nickname: In(user.followers.map((f) => f.fromNickname)),
      }),
    ]);
    await em.remove(user);
    this.eventBus.publishAll([
      new UserDeletedEvent(nickname),
      new ProfileAvatarChangedEvent(user.nickname, user.avatarUrl, null),
    ]);
  }
}
