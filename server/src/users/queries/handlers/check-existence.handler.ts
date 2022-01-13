import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { UsersRepository } from "src/users/users.repository";
import { CheckExistenceQuery } from "../check-existence.query";
import { BadRequestException } from "@nestjs/common";

@QueryHandler(CheckExistenceQuery)
export class CheckExistenceHandler
  implements IQueryHandler<CheckExistenceQuery>
{
  constructor(private readonly userRepository: UsersRepository) {}

  async execute(query: CheckExistenceQuery): Promise<boolean> {
    const { key, value } = query;
    let user;
    switch (key) {
      case "nickname":
        user = await this.userRepository.findByNickname(value);
        break;
      case "email":
        user = await this.userRepository.findByEmail(value);
        break;
      default:
        throw new BadRequestException("잘못된 key 값입니다");
    }
    if (user) return true;
    return false;
  }
}
