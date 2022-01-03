import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class LogoutGuard implements CanActivate {
  private readonly sessionCookieName: string;

  constructor(configService: ConfigService) {
    this.sessionCookieName = configService.get<string>("session.cookie-name");
  }

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();
    req.logout();
    res.clearCookie(this.sessionCookieName, { httpOnly: true });

    return true;
  }
}
