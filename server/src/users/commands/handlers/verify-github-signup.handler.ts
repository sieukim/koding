import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { VerifyGithubSignupCommand } from "../verify-github-signup.command";
import { User } from "../../../models/user.model";
import { UsersRepository } from "../../users.repository";
import { NotFoundException } from "@nestjs/common";

@CommandHandler(VerifyGithubSignupCommand)
export class VerifyGithubSignupHandler
  implements ICommandHandler<VerifyGithubSignupCommand, User>
{
  constructor(private readonly userRepository: UsersRepository) {}

  async execute(command: VerifyGithubSignupCommand): Promise<User> {
    const { verifyToken, newNickname, email } = command;
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundException("잘못된 이메일");
    user.verifyGithubSignup({ verifyToken, newNickname });
    return this.userRepository.updateByEmail(user);
  }
}
