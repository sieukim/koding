import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsNumberString, Length } from "class-validator";
import { User } from "../../entities/user.entity";

export class PasswordResetRequestDto extends PickType(User, [
  "email",
  "password",
]) {
  @ApiProperty({
    description: "비밀번호를 초기화할 사용자 이메일",
    example: "vvsos1@hotmail.co.kr",
  })
  email: string;

  @Length(6, 6)
  @IsNumberString({ no_symbols: true })
  @ApiProperty({
    description: "이메일로 받은 비밀번호 초기화 인증토큰",
    example: "945123",
    minLength: 6,
    maxLength: 6,
  })
  verifyToken: string;

  password!: string;
}
