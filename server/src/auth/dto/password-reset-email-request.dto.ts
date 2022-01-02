import { ApiProperty, PickType } from "@nestjs/swagger";
import { User } from "../../schemas/user.schema";

export class PasswordResetEmailRequestDto extends PickType(User, ["email"]) {
  @ApiProperty({
    description: "패스워드를 초기화 할 이메일",
    example: "test@test.com"
  })
  email: string;
}