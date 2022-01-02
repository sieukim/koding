import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../users/users.service";
import { SignupGithubVerifyRequestDto } from "./dto/signup-github-verify-request.dto";

export interface IGithubUserTypes {
    githubId: string;
    avatar: string;
    name: string;
    description: string;
    location: string;
}

@Injectable()
export class AuthService {
    private readonly githubClientId: string;
    private readonly githubClientSecret: string;
    private readonly logger = new Logger(AuthService.name);

    constructor(
      configService: ConfigService,
      private readonly usersService: UsersService
    ) {
        this.githubClientId = configService.get<string>(
          "auth.social.github.client_id"
        );
        this.githubClientSecret = configService.get<string>(
          "auth.social.github.client_secret"
        );
    }

    // public async getGithubInfo(
    //   githubCodeDto: GithubCodeDto,
    // ): Promise<IGithubUserTypes> {
    //   const { code } = githubCodeDto;
    //
    //   const getTokenUrl = 'https://github.com/login/oauth/access_token';
    //
    //   const request = {
    //     code,
    //     client_id: this.githubClientId,
    //     client_secret: this.githubClientSecret,
    //   };
    //
    //   const response = await axios.post(getTokenUrl, request, {
    //     headers: {
    //       accept: 'application/json',
    //     },
    //   });
    //
    //   if (response.data.error) {
    //     throw new HttpException(
    //       '깃허브 인증에 실패했습니다',
    //       HttpStatus.UNAUTHORIZED,
    //     );
    //   }
    //
    //   const { access_token } = response.data;
    //
    //   const getUserUrl = 'https://api.github.com/user';
    //
    //   const { data } = await axios.get(getUserUrl, {
    //     headers: {
    //       Authorization: `token ${access_token}`,
    //     },
    //   });
    //   this.logger.log('github info :', data);
    //
    //   const { login, avatar_url, name, bio, company, email } = data;
    //
    //   const githubUserInfo: IGithubUserTypes = {
    //     githubId: login,
    //     avatar: avatar_url,
    //     name,
    //     description: bio,
    //     location: company,
    //   };
    //   return githubUserInfo;
    // }

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findUserByEmail(email, true);
        if ((await user?.verifyPassword(password)) ?? false) {
            return user;
        }
        return null;
    }

    async verifyGithubSignupUser({ email, nickname, verifyToken }: SignupGithubVerifyRequestDto) {
        const user = await this.usersService.findUserByEmail(email);
        if (!user)
            return null;
        if (user.githubSignupVerifyToken !== verifyToken)
            throw new BadRequestException("유효하지 않은 토큰");
        user.nickname = nickname;
        user.githubSignupVerifyToken = undefined;
        user.githubSignupVerified = true;
        await user.save();
        return user;
    }
}
