import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { User } from "../../../entities/user.entity";
import { UnfollowUserCommand } from "../unfollow-user.command";
import { EntityManager, Transaction, TransactionManager } from "typeorm";

@CommandHandler(UnfollowUserCommand)
export class UnfollowUserHandler
  implements ICommandHandler<UnfollowUserCommand>
{
  @Transaction()
  async execute(
    command: UnfollowUserCommand,
    @TransactionManager() tm?: EntityManager,
  ) {
    const em = tm!;
    const { fromNickname, toNickname } = command;
    if (fromNickname === toNickname)
      throw new BadRequestException("자신을 언팔로우할 수 없습니다");
    const [fromUser, toUser] = await Promise.all([
      em.findOne(User, {
        where: { nickname: fromNickname },
        relations: ["followings"],
      }),
      em.findOne(User, { where: { nickname: toNickname } }),
    ]);
    if (!fromUser || !toUser)
      throw new NotFoundException("잘못된 사용자 정보입니다");
    fromUser.unfollowUser(toUser);
    await em.save(fromUser, { reload: false });
  }
}
