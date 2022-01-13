import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as cookieParser from "cookie-parser";
import * as session from "express-session";
import * as passport from "passport";
import * as mongoose from "mongoose";

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
    passport.session(),
  );
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
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
