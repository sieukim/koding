import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Request } from "express";
import { LoggedInGuard } from "./logged-in.guard";

@Injectable()
export class GithubUserGuard extends LoggedInGuard {
  canActivate(context: ExecutionContext): boolean {
    super.canActivate(context);
    const user = context.switchToHttp().getRequest<Request>().user;
    if (!(user?.isGithubUser ?? false))
      throw new ForbiddenException("깃허브 연동 유저만 접근할 수 있습니다");
    return true;
  }
}
