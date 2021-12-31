import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'id', passwordField: 'password' });
  }

  async validate(id: string, password: string) {
    const user = await this.authService.validateUser(id, password);
    if (!user)
      throw new UnauthorizedException('아이디 또는 비밀번호가 다릅니다');
    return user;
  }
}
