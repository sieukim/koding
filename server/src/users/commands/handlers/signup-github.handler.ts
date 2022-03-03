import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SignupGithubCommand } from "../signup-github.command";
import {
  GithubRepositoryInfo,
  GithubUserInfo,
  User,
} from "../../../entities/user.entity";
import axios from "axios";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { TemporaryGithubUser } from "../../../entities/temporary-github-user.entity";

@CommandHandler(SignupGithubCommand)
export class SignupGithubHandler
  implements ICommandHandler<SignupGithubCommand>
{
  @Transaction()
  async execute(
    command: SignupGithubCommand,
    @TransactionManager() tm?: EntityManager,
  ) {
    const em = tm!;
    const {
      signupGithubRequest: {
        githubId,
        githubUserIdentifier,
        reposUrl,
        avatarUrl,
        email,
        name,
      },
    } = command;
    let user = await em.findOne(User, { where: { githubUserIdentifier } });
    if (user) return user;

    const rawRepositories: any[] = (await axios.get(reposUrl)).data;

    const repositories = rawRepositories.map(
      ({ name, html_url: htmlUrl, description, stargazers_count: starCount }) =>
        ({ name, htmlUrl, description, starCount } as GithubRepositoryInfo),
    );

    const githubUserInfo = {
      githubId,
      email,
      name,
      avatarUrl,
      repositories,
    } as GithubUserInfo;

    user = await em.findOne(User, { where: { email } });
    if (user) {
      user.linkAccountWithGithub(githubUserIdentifier, githubUserInfo);
      await em.save(user, { reload: false });
      console.log("link account with github", user);
      return user;
    } else {
      const githubUser = new TemporaryGithubUser({
        email,
        githubUserInfo,
        githubUserIdentifier,
      });
      await em.save(githubUser, { reload: false });
      console.log("new github user:", githubUser);
      return githubUser;
    }
  }
}
