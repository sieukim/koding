import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      clientID: configService.get<string>('auth.social.kakao.client_id'),
      clientSecret: configService.get<string>(
        'auth.social.kakao.client_secret',
      ),
      callbackURL: 'http://localhost:3000/kakao-login',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    delete profile._raw;
    return this.usersService.signupKakao(profile);
  }
}
