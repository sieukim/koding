import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { CheckFollowingQuery } from "../check-following.query";
import { UsersRepository } from "../../users.repository";
import { NotFoundException } from "@nestjs/common";

@QueryHandler(CheckFollowingQuery)
export class CheckFollowingHandler
  implements IQueryHandler<CheckFollowingQuery>
{
  constructor(private readonly userRepository: UsersRepository) {}

  async execute(query: CheckFollowingQuery): Promise<any> {
    const { fromNickname, toNickname } = query;
    // TODO: $in 조건을 이용한 성능 개선
    const user = await this.userRepository.findOne({
      nickname: { eq: fromNickname },
      followingNicknames: { in: [toNickname] },
    });
    if (!user) throw new NotFoundException("잘못된 사용자");
    if (user.followingNicknames.some((nickname) => nickname === toNickname))
      return;
    else throw new NotFoundException("팔로우중이지 않습니다");
  }
}
