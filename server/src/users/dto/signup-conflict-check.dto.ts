import { PartialType, PickType } from '@nestjs/swagger';
import { User } from '../../schemas/user.schema';

export class SignupConflictCheckDto extends PartialType(
  PickType(User, ['id', 'email', 'nickname'] as const),
) {}
