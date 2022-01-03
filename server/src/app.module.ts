import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { configuration } from "./config/configutation";
import { AppLoggerMiddleware } from "./middlewares/logger.middleware";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "./users/users.module";
import { EmailModule } from "./email/email.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      expandVariables: true,
      cache: true
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
        uri: configService.get<string>("database.mongodb.uri")
      })
    }),
    AuthModule,
    UsersModule,
    EmailModule
  ],
  controllers: [],
  providers: []
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AppLoggerMiddleware).forRoutes("*");
  }
}
