import { ApiProperty } from "@nestjs/swagger";
import { UserInfoDto } from "./user-info.dto";
import { FollowUserResultDto } from "./follow-user-result.dto";
import { User } from "../../models/user.model";

export class UnfollowUserResultDto extends FollowUserResultDto {
  @ApiProperty({
    description: "언팔로우를 요청한 사용자",
  })
  from: UserInfoDto;
  @ApiProperty({
    description: "언팔로우한 사용자",
  })
  to: UserInfoDto;

  constructor(from: User, to: User) {
    super(from, to);
  }
}
