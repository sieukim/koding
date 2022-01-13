import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetFollowerUsersQuery } from "../get-follower-users.query";
import { UsersRepository } from "../../users.repository";
import { FollowerUsersInfoDto } from "../../dto/follower-users-info.dto";
import { User } from "../../../models/user.model";

@QueryHandler(GetFollowerUsersQuery)
export class GetFollowerUsersHandler
  implements IQueryHandler<GetFollowerUsersQuery, FollowerUsersInfoDto>
{
  constructor(private readonly userRepository: UsersRepository) {}

  async execute(query: GetFollowerUsersQuery): Promise<FollowerUsersInfoDto> {
    const { nickname } = query;
    const user = (await this.userRepository.findOneWith(
      {
        nickname: { eq: nickname },
      },
      ["followers"],
    )) as User & { followers: User[] };
    return new FollowerUsersInfoDto(user.followers);
  }
}
