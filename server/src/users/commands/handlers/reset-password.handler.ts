import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ResetPasswordCommand } from "../reset-password.command";
import { UsersRepository } from "../../users.repository";
import { NotFoundException } from "@nestjs/common";

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler
  implements ICommandHandler<ResetPasswordCommand, void>
{
  constructor(private readonly userRepository: UsersRepository) {}

  async execute(command: ResetPasswordCommand): Promise<void> {
    const { newPassword, email, verifyToken } = command;
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundException("잘못된 사용자");
    await user.verifyResetPassword({ verifyToken, newPassword });
    await this.userRepository.update(user);
  }
}
