import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UsersModule } from "../users/users.module";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./strategy/local.strategy";
import { GithubStrategy } from "./strategy/github.strategy";
import { LocalSerializer } from "./local.serializer";
import { EmailModule } from "../email/email.module";
import { CqrsModule } from "@nestjs/cqrs";

@Module({
  imports: [
    UsersModule,
    PassportModule.register({
      session: true,
    }),
    EmailModule,
    CqrsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalSerializer, LocalStrategy, GithubStrategy],
})
export class AuthModule {}
