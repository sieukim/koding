import { OmitType } from '@nestjs/swagger';
import { User } from '../../schemas/user.schema';

const excludeProperties = ['password', 'verifyToken'] as const;

export class LoginResultDto extends OmitType(User, excludeProperties) {
  constructor(user: User) {
    super();
    const keys: Array<keyof LoginResultDto> = [
      'id',
      'email',
      'nickname',
      'verified',
      'portfolioUrl',
      'githubUrl',
      'blogUrl',
      'githubUserInfo',
      'githubUserIdentifier',
      'kakaoUserIdentifier',
    ];
    keys.forEach((key) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return (this[key] = user[key]);
    });
  }
}
