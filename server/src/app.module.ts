import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { configuration } from "./config/configutation";
import { AppLoggerMiddleware } from "./common/middlewares/logger.middleware";
import { MongooseModule } from "@nestjs/mongoose";
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      expandVariables: true,
      cache: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // user: configService.get<string>('database.mongodb.username'),
        // pass: configService.get<string>('database.mongodb.password'),
        // auth: {
        //   username: 'user1',
        //   password: 'secret',
        // },
        uri: configService.get<string>("database.mongodb.uri"),
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: __dirname + "/../public",
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
