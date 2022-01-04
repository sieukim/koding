import { ApiProperty } from "@nestjs/swagger";
import { LoginResultDto } from "../../auth/dto/login-result.dto";
import { User } from "../../schemas/user.schema";

export class FollowUserResultDto {
  @ApiProperty({
    description: "팔로우를 요청한 유저"
  })
  from: LoginResultDto;
  @ApiProperty({
    description: "팔로우한 유저"
  })
  to: LoginResultDto;

  constructor(from: User, to: User) {
    this.from = new LoginResultDto(from);
    this.to = new LoginResultDto(to);
  }
}