import { Injectable, NotFoundException } from "@nestjs/common";
import { UsersRepository } from "../../users/users.repository";
import { currentTime } from "../../common/utils/current-time.util";

@Injectable()
export class UserSuspendService {
  private static readonly DEFAULT_SUSPEND_DAYS = 1;

  constructor(private readonly usersRepository: UsersRepository) {}

  async suspendUserAccount(nickname: string) {
    const user = await this.usersRepository.findByNickname(nickname);
    if (!user) throw new NotFoundException("없는 유저입니다");
    const suspendDueDate = currentTime();
    suspendDueDate.setDate(
      suspendDueDate.getDate() + UserSuspendService.DEFAULT_SUSPEND_DAYS,
    );
    user.accountSuspendedUntil = suspendDueDate;
    return this.usersRepository.update(user);
  }
}
