import { ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { VerifiedUserGuard } from "./verified-user.guard";

@Injectable()
export class ParamNicknameSameUserGuard extends VerifiedUserGuard {
  private readonly nicknameParamName: string = "nickname";

  canActivate(context: ExecutionContext): boolean {
    super.canActivate(context);
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;
    const nickname = request.params[this.nicknameParamName];
    user?.verifySameUser(nickname);
    return true;
  }
}
