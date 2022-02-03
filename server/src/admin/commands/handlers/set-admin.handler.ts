import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SetAdminCommand } from "../set-admin.command";
import { UsersRepository } from "../../../users/users.repository";
import { Role } from "../../../models/role.enum";

@CommandHandler(SetAdminCommand)
export class SetAdminHandler implements ICommandHandler<SetAdminCommand> {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(command: SetAdminCommand): Promise<any> {
    const { nickname } = command;
    const user = await this.usersRepository.findByNickname(nickname);
    if (!user.roles.includes(Role.Admin)) user.roles.push(Role.Admin);
    return this.usersRepository.update(user);
  }
}
