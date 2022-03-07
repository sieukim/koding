import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { User } from "../../entities/user.entity";

export class SignupGithubVerifyRequestDto extends PickType(User, [
  "email",
  "nickname",
]) {
  @ApiProperty({
    description: "인증할 사용자 이메일",
    example: "test@test.com",
  })
  email: string;

  @ApiProperty({
    description: "새로 설정할 닉네임",
    example: "testNick",
    minLength: 2,
    maxLength: 10,
  })
  nickname: string;

  @IsString()
  @ApiProperty({
    description: "깃허브로 회원가입 시 받은 인증 토큰",
    example: "9ad4af90-6976-11ec-9730-131e1ddb758c",
  })
  verifyToken: string;
}
