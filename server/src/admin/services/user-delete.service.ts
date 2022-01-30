import { UsersRepository } from "../../users/users.repository";
import { Injectable, NotFoundException } from "@nestjs/common";
import { currentTime } from "src/common/utils/current-time.util";

@Injectable()
export class UserDeleteService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async deleteAccount(nickname: string) {
    const user = await this.usersRepository.findByNickname(nickname);
    if (!user) throw new NotFoundException("없는 사용자입니다");
    user.accountDeletedSince = currentTime();
    return this.usersRepository.update(user);
  }
}
