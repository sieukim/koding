import { ApiProperty, PickType } from "@nestjs/swagger";
import { User } from "../../schemas/user.schema";
import { IsNumberString, Length } from "class-validator";

export class PasswordResetRequestDto extends PickType(User, ["email", "password"]) {
  @ApiProperty({
    description: "비밀번호를 초기화할 사용자 이메일",
    example: "test@test.com"
  })
  email: string;

  @Length(6, 6)
  @IsNumberString({ no_symbols: true })
  @ApiProperty({
    description: "이메일로 받은 비밀번호 초기화 인증코드",
    example: "945123",
    minLength: 6,
    maxLength: 6
  })
  verifyToken: string;
}