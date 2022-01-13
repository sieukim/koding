import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { FollowUserCommand } from "../follow-user.command";
import { UsersRepository } from "../../users.repository";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { User } from "../../../models/user.model";

@CommandHandler(FollowUserCommand)
export class FollowUserHandler implements ICommandHandler<FollowUserCommand> {
  constructor(private readonly userRepository: UsersRepository) {}

  async execute(command: FollowUserCommand): Promise<{ from: User; to: User }> {
    const { fromNickname, toNickname } = command;
    if (fromNickname === toNickname)
      throw new BadRequestException("자신은 팔로우할 수 없습니다");
    const users = await this.userRepository.findAll({
      nickname: { in: [fromNickname, toNickname] },
    });
    if (users.length !== 2)
      throw new NotFoundException("잘못된 유저 정보입니다");
    const fromUser = users.find((user) => user.nickname === fromNickname);
    const toUser = users.find((user) => user.nickname === toNickname);
    const { from, to } = await this.userRepository.followUser(fromUser, toUser);
    return { from, to };
  }
}
