import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ChangePasswordCommand } from "../change-password.command";
import { UsersRepository } from "../../users.repository";
import { NotFoundException } from "@nestjs/common";

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordHandler
  implements ICommandHandler<ChangePasswordCommand, void>
{
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(command: ChangePasswordCommand): Promise<void> {
    const { newPassword, currentPassword, nickname, requestUserNickname } =
      command;
    const [requestUser, user] = await Promise.all([
      this.usersRepository.findByNickname(requestUserNickname),
      this.usersRepository.findByNickname(nickname),
    ]);
    if (!requestUser) throw new NotFoundException("요청한 유저를 찾을 수 없음");
    if (!user) throw new NotFoundException("잘못된 사용자");
    await user.changePassword(requestUser, currentPassword, newPassword);
    await this.usersRepository.update(user);
  }
}
