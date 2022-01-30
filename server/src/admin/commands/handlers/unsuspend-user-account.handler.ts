import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UnsuspendUserAccountCommand } from "../unsuspend-user-account.command";
import { UserSuspendService } from "../../services/user-suspend.service";

@CommandHandler(UnsuspendUserAccountCommand)
export class UnsuspendUserAccountHandler
  implements ICommandHandler<UnsuspendUserAccountCommand>
{
  constructor(private readonly userSuspendService: UserSuspendService) {}

  async execute(command: UnsuspendUserAccountCommand): Promise<any> {
    const { nickname } = command;
    return this.userSuspendService.unsuspendUserAccount(nickname);
  }
}
