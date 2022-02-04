import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { NotFoundException, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as cookieParser from "cookie-parser";
import * as session from "express-session";
import * as passport from "passport";
import * as mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
import { RequestErrorLoggerInterceptor } from "./common/interceptors/request-error-logger.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 몽구스 쿼리 디버그
  mongoose.set("debug", true);
  const configService = app.get(ConfigService);
  app.use(
    cookieParser(configService.get<string>("cookie.secret")),
    session({
      secret: configService.get<string>("session.secret"),
      resave: false,
      saveUninitialized: false,
      cookie: { httpOnly: true },
      name: configService.get<string>("session.cookie-name"),
    }),
    passport.initialize(),
    // passport.session(),
    (req: Request, res: Response, next: NextFunction) => {
      passport.session()(req, res, (err) => {
        if (err instanceof NotFoundException) {
          console.log("세션에 삭제된 유저가 저장되어 있으므로 세선 삭제");
          req.logout();
          res.clearCookie(configService.get("session.cookie-name"));
          next();
        } else next(err);
      });
    },
  );

  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new RequestErrorLoggerInterceptor());
  const config = new DocumentBuilder()
    .setTitle("Koding API")
    // .setDescription("Sleact 개발을 위한 API 문서입니다.")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("api", app, document);

  await app.listen(3001);
}

bootstrap();
