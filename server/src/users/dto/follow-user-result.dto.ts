import { ApiProperty } from "@nestjs/swagger";
import { UserInfoDto } from "./user-info.dto";
import { User } from "../../models/user.model";

export class FollowUserResultDto {
  @ApiProperty({
    description: "팔로우를 요청한 유저",
  })
  from: UserInfoDto;
  @ApiProperty({
    description: "팔로우한 유저",
  })
  to: UserInfoDto;

  constructor(from: User, to: User) {
    this.from = new UserInfoDto(from);
    this.to = new UserInfoDto(to);
  }
}
