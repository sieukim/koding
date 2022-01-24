import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetMyUserInfoQuery } from "../get-my-user-info.query";
import { UsersRepository } from "../../users.repository";
import { NotFoundException } from "@nestjs/common";
import { MyUserInfoDto } from "../../dto/my-user-info.dto";

@QueryHandler(GetMyUserInfoQuery)
export class GetMyUserInfoHandler
  implements IQueryHandler<GetMyUserInfoQuery, MyUserInfoDto>
{
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(query: GetMyUserInfoQuery): Promise<MyUserInfoDto> {
    const { myNickname } = query;
    const me = await this.usersRepository.findByNickname(myNickname);
    if (!me) throw new NotFoundException("잘못된 사용자");
    return MyUserInfoDto.fromModel(me);
  }
}
