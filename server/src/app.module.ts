import {
  CACHE_MANAGER,
  MiddlewareConsumer,
  Module,
  NestModule,
} from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { configuration, KodingConfig } from "./config/configutation";
import { AppLoggerMiddleware } from "./common/middlewares/logger.middleware";
import { UsersModule } from "./users/users.module";
import { EmailModule } from "./email/email.module";
import { UploadModule } from "./upload/upload.module";
import { PostsModule } from "./posts/posts.module";
import { CommentsModule } from "./comments/comments.module";
import { ScheduleModule } from "@nestjs/schedule";
import { TagsModule } from "./tags/tags.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { SearchModule } from "./search/search.module";
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "./auth/guard/roles.guard";
import { AdminModule } from "./admin/admin.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as fs from "fs";
import * as path from "path";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { ThrottlerStorageRedisService } from "nestjs-throttler-storage-redis";
import { RedisCache } from "./index";
import { TypeOrmLoggerContainer } from "./typeorm.logger";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      expandVariables: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<KodingConfig, true>) => ({
        type: "mysql",
        host: configService.get("database.mysql.host", { infer: true }),
        username: configService.get("database.mysql.username", { infer: true }),
        password: configService.get("database.mysql.password", { infer: true }),
        database: configService.get("database.mysql.database", { infer: true }),
        entities: ["dist/**/*.entity{.ts,.js}"],
        charset: "utf8mb4",
        logging: ["query"],
        logger: TypeOrmLoggerContainer.forConnection("koding-mysql", ["query"]),
        // synchronize: true,
        // dropSchema: true,
        ssl: configService.get("environment", { infer: true }) ===
          "production" && {
          ca: fs.readFileSync(
            path.join(__dirname, "..", "DigiCertGlobalRootCA.crt.pem"),
          ),
        },
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, "..", "public"),
    }),
    ThrottlerModule.forRootAsync({
      inject: [CACHE_MANAGER],
      useFactory: (cache: RedisCache) => ({
        ttl: 60,
        limit: 50,
        storage: new ThrottlerStorageRedisService(cache.store.getClient()),
      }),
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    EmailModule,
    UploadModule,
    PostsModule,
    CommentsModule,
    TagsModule,
    NotificationsModule,
    SearchModule,
    AdminModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AppLoggerMiddleware).forRoutes("*");
  }
}
