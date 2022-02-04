import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { Request } from "express";

@Injectable()
export class RequestErrorLoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestErrorLoggerInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const { method, originalUrl: url } = context
      .switchToHttp()
      .getRequest<Request>();
    return next.handle().pipe(
      tap({
        error: (err) => {
          if (err instanceof HttpException) {
            const msg = err.getResponse();
            this.logger.log(
              `error on ${method} ${url}; ${err}, ${
                msg instanceof String ? msg : JSON.stringify(msg)
              }`,
            );
          } else this.logger.log(`error on ${method} ${url}; ${err}`);
        },
      }),
    );
  }
}
