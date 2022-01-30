import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SuspendUserAccountCommand } from "../suspend-user-account.command";
import { UserSuspendService } from "../../services/user-suspend.service";
import { User } from "../../../models/user.model";

@CommandHandler(SuspendUserAccountCommand)
export class SuspendUserAccountHandler
  implements ICommandHandler<SuspendUserAccountCommand>
{
  constructor(private readonly userSuspendService: UserSuspendService) {}

  async execute(command: SuspendUserAccountCommand): Promise<User> {
    const { nickname } = command;
    return this.userSuspendService.suspendUserAccount(nickname);
  }
}
