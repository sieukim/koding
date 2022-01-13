import { ExecutionContext, ForbiddenException } from "@nestjs/common";
import { LoggedInGuard } from "./logged-in.guard";
import { Request } from "express";

export class VerifiedUserGuard extends LoggedInGuard {
  canActivate(context: ExecutionContext): boolean {
    super.canActivate(context);

    const user = context.switchToHttp().getRequest<Request>().user;
    if (!user.isVerifiedUser)
      throw new ForbiddenException(
        "회원가입 인증(이메일 인증 혹은 닉네임 설정)을 한 유저만 접근할 수 있습니다",
      );

    return true;
  }
}
