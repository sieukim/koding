import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Request } from "express";

export class ParamNicknameSameUserGuard implements CanActivate {
  constructor(
    private readonly nicknameParamName: string = "nickname",
    private readonly forbiddenMessage = "사용자에 대한 권한이 없습니다",
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;
    const nickname = request.params[this.nicknameParamName];
    if (user?.nickname !== nickname)
      throw new ForbiddenException(this.forbiddenMessage);
    return true;
  }
}
