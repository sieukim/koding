import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetUserInfoQuery } from "../get-user-info.query";
import { UsersRepository } from "../../users.repository";
import { UserInfoDto } from "../../dto/user-info.dto";
import { NotFoundException } from "@nestjs/common";

@QueryHandler(GetUserInfoQuery)
export class GetUserInfoHandler
  implements IQueryHandler<GetUserInfoQuery, UserInfoDto>
{
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(query: GetUserInfoQuery): Promise<UserInfoDto> {
    const { nickname } = query;
    const user = await this.usersRepository.findByNickname(nickname);
    if (!user) throw new NotFoundException("잘못된 사용자");
    return UserInfoDto.fromModel(user);
  }
}
