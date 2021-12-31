import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { GithubStrategy } from './strategy/github.strategy';
import { LocalSerializer } from './local.serializer';
import { KakaoStrategy } from './strategy/kakao.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({
      session: true,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalSerializer,
    LocalStrategy,
    GithubStrategy,
    KakaoStrategy,
  ],
})
export class AuthModule {}
