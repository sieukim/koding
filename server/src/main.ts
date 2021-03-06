import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import {
  CACHE_MANAGER,
  Logger,
  NotFoundException,
  ValidationPipe,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as cookieParser from "cookie-parser";
import * as session from "express-session";
import * as passport from "passport";
import * as express from "express";
import { NextFunction, Request, Response } from "express";
import { RequestErrorLoggerInterceptor } from "./common/interceptors/request-error-logger.interceptor";
import * as connectRedis from "connect-redis";
import { RedisCache } from "./index";
import * as http from "http";
import { ExpressAdapter } from "@nestjs/platform-express";
import * as https from "https";
import { ServerOptions } from "https";
import * as fs from "fs";
import * as path from "path";
import { KodingConfig } from "./config/configutation";

const logger = new Logger("Root");

async function testRedisConnection(cache: RedisCache) {
  await cache.set("test", "success");
  const success = (await cache.get("test")) === "success";
  if (success) logger.log(`Redis Connection Success`);
  else logger.warn(`Redis Connection Fail`);
}

function createRedisSessionStore(cache: RedisCache) {
  const RedisStore = connectRedis(session);
  return new RedisStore({
    client: cache.store.getClient(),
  });
}

const httpsOptions: ServerOptions = {
  key: fs.readFileSync(
    path.join(__dirname, "..", "secrets", "private-key.pem"),
  ),
  cert: fs.readFileSync(
    path.join(__dirname, "..", "secrets", "public-certificate.pem"),
  ),
};

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  const redisCacheManager = app.get<RedisCache>(CACHE_MANAGER);
  // elasticCache 연결 테스트
  await testRedisConnection(redisCacheManager);
  const configService =
    app.get<ConfigService<KodingConfig, true>>(ConfigService);
  app.use(
    cookieParser(configService.get("cookie.secret", { infer: true })),
    session({
      secret: configService.get("session.secret", { infer: true }),
      resave: false,
      saveUninitialized: false,
      cookie: { httpOnly: true },
      name: configService.get("session.cookie-name", { infer: true }),
      store: createRedisSessionStore(redisCacheManager),
    }),
    passport.initialize(),
    // passport.session(),
    (req: Request, res: Response, next: NextFunction) => {
      passport.session()(req, res, (err) => {
        if (err instanceof NotFoundException) {
          console.log("세션에 삭제된 유저가 저장되어 있으므로 세선 삭제");
          req.logout();
          res.clearCookie(
            configService.get("session.cookie-name", { infer: true }),
          );
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

  await app.init();
  http.createServer(server).listen(configService.get<number>("port") ?? 80);
  https.createServer(httpsOptions, server).listen(443);
}

bootstrap();
