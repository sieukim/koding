import { PickType } from '@nestjs/swagger';
import { User } from '../../schemas/user.schema';

export class LoginLocalDto extends PickType(User, ['id', 'password']) {}
