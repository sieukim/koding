import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { FollowUserCommand } from "../follow-user.command";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { User } from "../../../entities/user.entity";
import { EntityManager, Transaction, TransactionManager } from "typeorm";

@CommandHandler(FollowUserCommand)
export class FollowUserHandler implements ICommandHandler<FollowUserCommand> {
  constructor(private readonly publisher: EventPublisher) {}

  @Transaction()
  async execute(
    command: FollowUserCommand,
    @TransactionManager() tm?: EntityManager,
  ) {
    const em = tm!;
    const { fromNickname, toNickname } = command;
    if (fromNickname === toNickname)
      throw new BadRequestException("자신을 팔로우할 수 없습니다");
    // eslint-disable-next-line prefer-const
    let [fromUser, toUser] = await Promise.all([
      em.findOne(User, {
        where: { nickname: fromNickname },
        relations: ["followings"],
      }),
      em.findOne(User, {
        where: { nickname: toNickname },
      }),
    ]);
    if (!fromUser || !toUser)
      throw new NotFoundException("잘못된 사용자 정보입니다");
    fromUser = this.publisher.mergeObjectContext(fromUser);
    fromUser.followUser(toUser);
    await em.save(User, fromUser, { reload: false });
    fromUser.commit();
  }
}
