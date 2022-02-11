import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { ChangeProfileCommand } from "../change-profile.command";
import { UsersRepository } from "../../users.repository";
import { NotFoundException } from "@nestjs/common";
import { User } from "../../../models/user.model";

@CommandHandler(ChangeProfileCommand)
export class ChangeProfileHandler
  implements ICommandHandler<ChangeProfileCommand, User>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: ChangeProfileCommand): Promise<User> {
    const { nickname, requestUserNickname, request } = command;

    // eslint-disable-next-line prefer-const
    let [requestUser, user] = await Promise.all([
      this.usersRepository.findByNickname(requestUserNickname),
      this.usersRepository.findByNickname(nickname),
    ]);
    if (!requestUser) throw new NotFoundException("요청한 유저를 찾을 수 없음");
    if (!user) throw new NotFoundException("잘못된 사용자");
    user = this.eventPublisher.mergeObjectContext(user);
    user.changeProfile(requestUser, request);
    const result = this.usersRepository.update(user);
    user.commit();
    return result;
  }
}
