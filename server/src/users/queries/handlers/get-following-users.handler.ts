import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetFollowingUsersQuery } from "../get-following-users.query";
import { UsersRepository } from "../../users.repository";
import { FollowingUsersInfoDto } from "../../dto/following-users-info.dto";
import { User } from "../../../models/user.model";

@QueryHandler(GetFollowingUsersQuery)
export class GetFollowingUsersHandler
  implements IQueryHandler<GetFollowingUsersQuery, FollowingUsersInfoDto>
{
  constructor(private readonly userRepository: UsersRepository) {}

  async execute(query: GetFollowingUsersQuery): Promise<FollowingUsersInfoDto> {
    const { nickname } = query;
    const user = (await this.userRepository.findOneWith(
      {
        nickname: { eq: nickname },
      },
      ["followings"],
    )) as User & { followings: User[] };
    return new FollowingUsersInfoDto(user.followings);
  }
}
