import { BadRequestException, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class LocalAuthGuard extends AuthGuard("local") {
  private readonly logger = new Logger(LocalAuthGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (await super.canActivate(context)) {
      const request = context.switchToHttp().getRequest();
      await super.logIn(request);
    }
    return true;
  }

  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    if (err)
      this.logger.error(err);
    if (!user)
      throw new UnauthorizedException("아이디 또는 비밀번호가 다릅니다");
    if (err)
      throw new BadRequestException();
    return user;
  }
}
