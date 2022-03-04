import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { ConfigService } from "@nestjs/config";
import { KodingConfig } from "../../../config/configutation";

@Injectable()
export class LogoutGuard implements CanActivate {
  private readonly sessionCookieName: string;

  constructor(configService: ConfigService<KodingConfig, true>) {
    this.sessionCookieName = configService.get("session.cookie-name", {
      infer: true,
    });
  }

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();
    req.logout();
    res.clearCookie(this.sessionCookieName, { httpOnly: true });

    return true;
  }
}
