import { User } from "../../entities/user.entity";
import { UserInfoDto } from "./user-info.dto";
import { ApiProperty } from "@nestjs/swagger";

export class FollowingUsersInfoDto {
  @ApiProperty({
    description: "내가 팔로우하는 유저들 정보의 배열",
    type: [UserInfoDto],
  })
  followings: UserInfoDto[];
  @ApiProperty({
    description: "내가 팔로우하는 유저의 수",
    type: Number,
  })
  count: number;

  constructor(followingUsers: User[]) {
    this.followings = followingUsers.map(UserInfoDto.fromModel);
    this.count = this.followings.length;
  }
}
