import { ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Request } from "express";
import { LoggedInGuard } from "./logged-in.guard";


@Injectable()
export class EmailUserGuard extends LoggedInGuard {
  canActivate(context: ExecutionContext): boolean {
    super.canActivate(context);
    const user = context
      .switchToHttp()
      .getRequest<Request>()
      .user;
    if (!(user?.isEmailUser ?? false))
      throw new ForbiddenException("이메일로 가입된 유저만 접근할 수 있습니다");
    return true;
  }
}

@Injectable()
export class EmailVerifiedUserGuard extends EmailUserGuard {
  canActivate(context: ExecutionContext): boolean {
    super.canActivate(context);
    const user = context
      .switchToHttp()
      .getRequest<Request>()
      .user;
    if (!user.emailSignupVerified)
      throw new ForbiddenException("이메일 회원가입 인증(이메일 인증)이 된 유저만 접근할 수 있습니다");
    return true;
  }
}