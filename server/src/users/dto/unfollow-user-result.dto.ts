import { ApiProperty } from "@nestjs/swagger";
import { LoginResultDto } from "../../auth/dto/login-result.dto";
import { User } from "../../schemas/user.schema";
import { FollowUserResultDto } from "./follow-user-result.dto";

export class UnfollowUserResultDto extends FollowUserResultDto {
  @ApiProperty({
    description: "언팔로우를 요청한 유저"
  })
  from: LoginResultDto;
  @ApiProperty({
    description: "언팔로우한 유저"
  })
  to: LoginResultDto;

  constructor(from: User, to: User) {
    super(from, to);
  }
}