import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../users/users.service";
import { EmailService } from "../email/email.service";

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
    private readonly usersService: UsersService,
    private readonly emailService: EmailService
  ) {
    this.githubClientId = configService.get<string>(
      "auth.social.github.client_id"
    );
    this.githubClientSecret = configService.get<string>(
      "auth.social.github.client_secret"
    );
  }

  async validateUser({ email, password }: { email: string, password: string }) {
    const user = await this.usersService.findUserByEmail(email, true);
    if ((await user?.verifyPassword(password)) ?? false) {
      return user;
    }
    return null;
  }

  async verifyGithubSignupUser({
                                 email,
                                 nickname,
                                 verifyToken
                               }: { email: string, nickname: string, verifyToken: string }) {
    const user = await this.usersService.findUserByEmail(email);
    if (!user)
      throw new NotFoundException();
    user.verifyGithubSignup({ verifyToken, newNickname: nickname });
    await user.save();
    return user;
  }

  async sendPasswordResetToken({ email }: { email: string }) {
    const user = await this.usersService.findUserByEmail(email);
    if (!user)
      throw new NotFoundException();
    user.setNewPasswordResetToken();
    await Promise.all([user.save(), this.emailService.sendPasswordResetToken(email, user.passwordResetToken)]);


  }


  async resetPassword({ email, password, verifyToken }: { email: string, password: string, verifyToken: string }) {
    const user = await this.usersService.findUserByEmail(email);
    if (!user)
      throw new NotFoundException();
    await user.verifyResetPassword({ verifyToken, newPassword: password });
    await user.save();
  }
}
