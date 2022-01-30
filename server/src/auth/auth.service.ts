import { ForbiddenException, Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ComparePasswordCommand } from "../users/commands/compare-password.command";
import { ComparePasswordHandler } from "../users/commands/handlers/compare-password.handler";
import { VerifyGithubSignupCommand } from "../users/commands/verify-github-signup.command";
import { VerifyGithubSignupHandler } from "../users/commands/handlers/verify-github-signup.handler";
import { ResetPasswordRequestCommand } from "../users/commands/reset-password-request.command";
import { ResetPasswordRequestHandler } from "../users/commands/handlers/reset-password-request.handler";
import { ResetPasswordCommand } from "../users/commands/reset-password.command";
import { ResetPasswordHandler } from "../users/commands/handlers/reset-password.handler";
import { CheckPasswordTokenValidityQuery } from "../users/queries/check-password-token-validity.query";
import { CheckPasswordTokenValidityHandler } from "../users/queries/handlers/check-password-token-validity.handler";
import { currentTime } from "../common/utils/current-time.util";
import { User } from "../models/user.model";

@Injectable()
export class AuthService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  validateUser({ email, password }: { email: string; password: string }) {
    return this.commandBus.execute(
      new ComparePasswordCommand(email, password),
    ) as ReturnType<ComparePasswordHandler["execute"]>;
  }

  verifyGithubSignupUser({
    email,
    nickname,
    verifyToken,
  }: {
    email: string;
    nickname: string;
    verifyToken: string;
  }) {
    return this.commandBus.execute(
      new VerifyGithubSignupCommand(email, nickname, verifyToken),
    ) as ReturnType<VerifyGithubSignupHandler["execute"]>;
  }

  sendPasswordResetToken({ email }: { email: string }) {
    return this.commandBus.execute(
      new ResetPasswordRequestCommand(email),
    ) as ReturnType<ResetPasswordRequestHandler["execute"]>;
  }

  resetPassword({
    email,
    password,
    verifyToken,
  }: {
    email: string;
    password: string;
    verifyToken: string;
  }) {
    return this.commandBus.execute(
      new ResetPasswordCommand(email, password, verifyToken),
    ) as ReturnType<ResetPasswordHandler["execute"]>;
  }

  checkPasswordTokenValidity({
    email,
    verifyToken,
  }: {
    email: string;
    verifyToken: string;
  }) {
    return this.queryBus.execute(
      new CheckPasswordTokenValidityQuery(email, verifyToken),
    ) as ReturnType<CheckPasswordTokenValidityHandler["execute"]>;
  }

  checkAccountNotSuspended(user: User) {
    if (
      user.accountSuspendedUntil &&
      user.accountSuspendedUntil.getTime() > currentTime().getTime()
    ) {
      throw new ForbiddenException({
        message: "계정이 " + user.accountSuspendedUntil + "까지 정지되었습니다",
        suspendDate: user.accountSuspendedUntil,
      });
    }
  }
}
