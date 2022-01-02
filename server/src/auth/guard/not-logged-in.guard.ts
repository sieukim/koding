import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class NotLoggedInGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const authenticated = context
          .switchToHttp()
          .getRequest<Request>()
          .isAuthenticated();
        return !authenticated;
    }
}
