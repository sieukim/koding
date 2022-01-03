import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class NotLoggedInGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const authenticated = context
      .switchToHttp()
      .getRequest<Request>()
      .isAuthenticated();
    if (authenticated)
      throw new ForbiddenException("로그인한 사용자는 이용할 수 없습니다");
    return true;
  }
}
