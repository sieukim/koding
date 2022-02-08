import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { DeleteAvatarCommand } from "../delete-avatar.command";
import { UsersRepository } from "../../users.repository";
import { NotFoundException } from "@nestjs/common";

@CommandHandler(DeleteAvatarCommand)
export class DeleteAvatarHandler
  implements ICommandHandler<DeleteAvatarCommand>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: DeleteAvatarCommand) {
    const { nickname } = command;
    let user = await this.usersRepository.findByNickname(nickname);
    if (!user) throw new NotFoundException("없는 사용자");
    user = this.eventPublisher.mergeObjectContext(user);
    user.deleteAvatar();
    await this.usersRepository.update(user);
    user.commit();
    return;
  }
}
