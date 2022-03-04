import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-github2";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../auth.service";
import { CommandBus } from "@nestjs/cqrs";
import { SignupGithubRequestDto } from "../dto/signup-github-request.dto";
import { validateOrReject } from "class-validator";
import { SignupGithubCommand } from "../../users/commands/signup-github.command";
import { SignupGithubHandler } from "../../users/commands/handlers/signup-github.handler";
import { User } from "../../entities/user.entity";
import { KodingConfig } from "../../config/configutation";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, "github") {
  constructor(
    private readonly authService: AuthService,
    private readonly commandBus: CommandBus,
    configService: ConfigService<KodingConfig, true>,
  ) {
    super({
      clientID: configService.get("auth.social.github.client_id", {
        infer: true,
      }),
      clientSecret: configService.get("auth.social.github.client_secret", {
        infer: true,
      }),
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    delete profile._raw;
    const {
      id,
      login: githubId,
      email,
      name,
      avatar_url: avatarUrl,
      repos_url,
    } = profile._json;

    const githubUserIdentifier = id as number;
    const signupGithubRequest = new SignupGithubRequestDto({
      githubId,
      email,
      name,
      reposUrl: repos_url,
      avatarUrl,
      githubUserIdentifier,
    });
    console.log(signupGithubRequest);
    await validateOrReject(signupGithubRequest);
    const user = (await this.commandBus.execute(
      new SignupGithubCommand(signupGithubRequest),
    )) as Awaited<ReturnType<SignupGithubHandler["execute"]>>;
    if (user instanceof User) this.authService.checkAccountNotSuspended(user);
    return user;
  }
}
