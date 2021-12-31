import { PickType } from '@nestjs/swagger';
import { User } from '../../schemas/user.schema';

export class SignupLocalDto extends PickType(User, [
  'id',
  'email',
  'password',
  'nickname',
  'blogUrl',
  'githubUrl',
  'portfolioUrl',
]) {}
