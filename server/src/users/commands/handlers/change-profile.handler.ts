import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ChangeProfileCommand } from "../change-profile.command";
import { UsersRepository } from "../../users.repository";
import { MyUserInfoDto } from "../../dto/my-user-info.dto";
import { NotFoundException } from "@nestjs/common";

@CommandHandler(ChangeProfileCommand)
export class ChangeProfileHandler
  implements ICommandHandler<ChangeProfileCommand, MyUserInfoDto>
{
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(command: ChangeProfileCommand): Promise<MyUserInfoDto> {
    const { nickname, requestUserNickname, request } = command;

    const [requestUser, user] = await Promise.all([
      this.usersRepository.findByNickname(requestUserNickname),
      this.usersRepository.findByNickname(nickname),
    ]);
    if (!requestUser) throw new NotFoundException("요청한 유저를 찾을 수 없음");
    if (!user) throw new NotFoundException("잘못된 사용자");
    await user.changeProfile(requestUser, request);
    return new MyUserInfoDto(await this.usersRepository.update(user));
  }
}
