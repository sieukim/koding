import { ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { LoggedInGuard } from "./logged-in.guard";

@Injectable()
export class ParamNicknameSameUserGuard extends LoggedInGuard {
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
