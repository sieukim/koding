import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { DeleteAccountCommand } from "../delete-account.command";
import { UsersRepository } from "../../users.repository";
import { UserDeletedEvent } from "../../events/user-deleted.event";

@CommandHandler(DeleteAccountCommand)
export class DeleteAccountHandler
  implements ICommandHandler<DeleteAccountCommand>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeleteAccountCommand): Promise<void> {
    const { requestUserNickname, nickname } = command;
    const [requestUser, user] = await Promise.all([
      this.usersRepository.findByNickname(requestUserNickname),
      this.usersRepository.findByNickname(nickname),
    ]);
    user.verifySameUser(requestUser);
    await this.usersRepository.remove(user);
    this.eventBus.publish(new UserDeletedEvent(nickname));
  }
}
