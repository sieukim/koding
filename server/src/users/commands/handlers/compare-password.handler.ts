import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ComparePasswordCommand } from "../compare-password.command";
import { User } from "../../../entities/user.entity";
import { EntityManager, Transaction, TransactionManager } from "typeorm";

@CommandHandler(ComparePasswordCommand)
export class ComparePasswordHandler
  implements ICommandHandler<ComparePasswordCommand, User | null>
{
  @Transaction({ isolation: "READ UNCOMMITTED" })
  async execute(
    command: ComparePasswordCommand,
    @TransactionManager() tm?: EntityManager,
  ): Promise<User | null> {
    const em = tm!;
    const { password, email } = command;
    const user = await em.findOne(User, { where: { email } });
    if (!user) return null;
    if (await user.comparePassword(password)) return user;
    return null;
  }
}
