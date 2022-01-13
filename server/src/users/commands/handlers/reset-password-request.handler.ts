import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { ResetPasswordRequestCommand } from "../reset-password-request.command";
import { UsersRepository } from "../../users.repository";
import { NotFoundException } from "@nestjs/common";

@CommandHandler(ResetPasswordRequestCommand)
export class ResetPasswordRequestHandler
  implements ICommandHandler<ResetPasswordRequestCommand, void>
{
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: ResetPasswordRequestCommand): Promise<void> {
    const { email } = command;
    let user = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundException("잘못된 사용자입니다");
    user = this.publisher.mergeObjectContext(user);
    user.sendPasswordResetEmail();
    user.commit();
    await this.userRepository.update(user);
  }
}
