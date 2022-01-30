import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ForceDeleteUserAccountCommand } from "../force-delete-user-account.command";
import { UserDeleteService } from "../../services/user-delete.service";
import { User } from "../../../models/user.model";

@CommandHandler(ForceDeleteUserAccountCommand)
export class ForceDeleteUserAccountHandler
  implements ICommandHandler<ForceDeleteUserAccountCommand>
{
  constructor(private readonly userDeleteService: UserDeleteService) {}

  async execute(command: ForceDeleteUserAccountCommand): Promise<User> {
    const { nickname } = command;
    return this.userDeleteService.deleteAccount(nickname);
  }
}
