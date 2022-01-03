import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class LoggedInGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const authenticated = context
      .switchToHttp()
      .getRequest<Request>()
      .isAuthenticated();
    if (!authenticated)
      throw new ForbiddenException("로그인한 유저만 접근할 수 있습니다");
    return true;
  }
}
