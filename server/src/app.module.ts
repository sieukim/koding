import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { configuration } from "./config/configutation";
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
      useFactory: (configService: ConfigService<any, true>) => ({
        type: "mysql",
        host: configService.get<string>("database.mysql.host"),
        username: configService.get<string>("database.mysql.username"),
        password: configService.get<string>("database.mysql.password"),
        database: configService.get<string>("database.mysql.database"),
        entities: ["dist/**/*.entity{.ts,.js}"],
        charset: "utf8mb4",
        logging: ["query"],
        // synchronize: true,
        // dropSchema: true,
        ssl: configService.get<string>("environment") === "production" && {
          ca: fs.readFileSync(
            path.join(__dirname, "..", "DigiCertGlobalRootCA.crt.pem"),
          ),
        },
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, "..", "public"),
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
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AppLoggerMiddleware).forRoutes("*");
  }
}
