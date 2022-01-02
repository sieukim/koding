import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-github2";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../../users/users.service";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, "github") {
    constructor(
      private readonly usersService: UsersService,
      configService: ConfigService
    ) {
        super({
            clientID: configService.get<string>("auth.social.github.client_id"),
            clientSecret: configService.get<string>(
              "auth.social.github.client_secret"
            )
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any) {
        delete profile._raw;
        return this.usersService.signupGithub(profile);
    }
}
