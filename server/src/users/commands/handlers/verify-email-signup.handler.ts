import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { VerifyEmailSignupCommand } from "../verify-email-signup.command";
import { UsersRepository } from "../../users.repository";
import { NotFoundException } from "@nestjs/common";

@CommandHandler(VerifyEmailSignupCommand)
export class VerifyEmailSignupHandler
  implements ICommandHandler<VerifyEmailSignupCommand>
{
  constructor(private readonly userRepository: UsersRepository) {}

  async execute(command: VerifyEmailSignupCommand): Promise<any> {
    const { verifyToken, nickname } = command;
    const user = await this.userRepository.findByNickname(nickname);
    if (!user) throw new NotFoundException("잘못된 사용자입니다");
    user.verifyEmailSignup(verifyToken);
    await this.userRepository.update(user);
  }
}
