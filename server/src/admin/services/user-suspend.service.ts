import { Injectable, NotFoundException } from "@nestjs/common";
import { UsersRepository } from "../../users/users.repository";
import { getCurrentUTCTime } from "../../common/utils/time.util";

@Injectable()
export class UserSuspendService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async suspendUserAccount(
    nickname: string,
    forever: boolean,
    suspendDay?: number,
  ) {
    if (forever) suspendDay = 365 * 1000;
    const user = await this.usersRepository.findByNickname(nickname);
    if (!user) throw new NotFoundException("없는 유저입니다");
    const suspendDueDate = getCurrentUTCTime();
    suspendDueDate.setDate(suspendDueDate.getDate() + suspendDay);
    user.accountSuspendedUntil = suspendDueDate;
    return this.usersRepository.update(user);
  }

  async unsuspendUserAccount(nickname: string) {
    const user = await this.usersRepository.findByNickname(nickname);
    user.accountSuspendedUntil = undefined;
    return this.usersRepository.update(user);
  }
}
