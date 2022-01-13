import {
  BadRequestException,
  ExecutionContext,
  Injectable,
  Logger,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class GithubAuthGuard extends AuthGuard("github") {
  private readonly logger = new Logger(GithubAuthGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (await super.canActivate(context)) {
      const request = context.switchToHttp().getRequest();
      await super.logIn(request);
    }
    return true;
  }

  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    if (err) this.logger.error(err);
    if (err || !user) throw new BadRequestException();
    return user;
  }
}
