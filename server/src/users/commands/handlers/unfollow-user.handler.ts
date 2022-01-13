import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsersRepository } from "../../users.repository";
import { NotFoundException } from "@nestjs/common";
import { User } from "../../../models/user.model";
import { UnfollowUserCommand } from "../unfollow-user.command";

@CommandHandler(UnfollowUserCommand)
export class UnfollowUserHandler
  implements ICommandHandler<UnfollowUserCommand>
{
  constructor(private readonly userRepository: UsersRepository) {}

  async execute(
    command: UnfollowUserCommand,
  ): Promise<{ from: User; to: User }> {
    const { fromNickname, toNickname } = command;
    const users = await this.userRepository.findAll({
      nickname: { in: [fromNickname, toNickname] },
    });
    if (users.length !== 2)
      throw new NotFoundException("잘못된 유저 정보입니다");
    const fromUser = users.find((user) => user.nickname === fromNickname);
    const toUser = users.find((user) => user.nickname === toNickname);
    const { from, to } = await this.userRepository.unfollowUser(
      fromUser,
      toUser,
    );
    return { from, to };
  }
}