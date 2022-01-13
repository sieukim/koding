import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { CheckPasswordTokenValidityQuery } from "../check-password-token-validity.query";
import { UsersRepository } from "../../users.repository";
import { NotFoundException } from "@nestjs/common";

@QueryHandler(CheckPasswordTokenValidityQuery)
export class CheckPasswordTokenValidityHandler
  implements IQueryHandler<CheckPasswordTokenValidityQuery, void>
{
  constructor(private readonly userRepository: UsersRepository) {}

  async execute(query: CheckPasswordTokenValidityQuery): Promise<void> {
    const { verifyToken, email } = query;
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundException("잘못된 사용자");
    user.verifyPasswordResetToken(verifyToken);
  }
}
