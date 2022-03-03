import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { VerifyGithubSignupCommand } from "../verify-github-signup.command";
import { User } from "../../../entities/user.entity";
import { BadRequestException } from "@nestjs/common";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { TemporaryGithubUser } from "../../../entities/temporary-github-user.entity";

@CommandHandler(VerifyGithubSignupCommand)
export class VerifyGithubSignupHandler
  implements ICommandHandler<VerifyGithubSignupCommand, User>
{
  @Transaction()
  async execute(
    command: VerifyGithubSignupCommand,
    @TransactionManager() tm?: EntityManager,
  ): Promise<User> {
    const em = tm!;
    const { verifyToken, newNickname, email } = command;
    const githubUser = await em
      .findOneOrFail(TemporaryGithubUser, { where: { email } })
      .catch(() => {
        throw new BadRequestException("깃허브 연동 사용자가 아닙니다");
      });
    githubUser.verify(verifyToken);

    const user = new User({
      isGithubUser: true,
      nickname: newNickname,
      email,
      githubUserIdentifier: githubUser.githubUserIdentifier,
      githubUserInfo: githubUser.githubUserInfo,
    });
    const [result] = await Promise.all([
      em.save(user, { reload: false }),
      em.remove(githubUser),
    ]);
    return result;
  }
}
