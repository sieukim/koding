import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ComparePasswordCommand } from "../compare-password.command";
import { UsersRepository } from "../../users.repository";
import { User } from "../../../models/user.model";

@CommandHandler(ComparePasswordCommand)
export class ComparePasswordHandler
  implements ICommandHandler<ComparePasswordCommand, User | null>
{
  constructor(private readonly userRepository: UsersRepository) {}

  async execute(command: ComparePasswordCommand): Promise<User | null> {
    const { password, email } = command;
    const user = await this.userRepository.findByEmail(email);
    if (!user) return null;
    console.log("password: ", password, ", user:", user);
    if (await user.comparePassword(password)) return user;
    return null;
  }
}
