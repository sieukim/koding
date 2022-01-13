import { User } from "../../models/user.model";
import { UserInfoDto } from "../../auth/dto/user-info.dto";
import { ApiProperty } from "@nestjs/swagger";

export class FollowerUsersInfoDto {
  @ApiProperty({
    description: "나를 팔로우하는 유저들 정보의 배열",
    type: [UserInfoDto],
  })
  followers: UserInfoDto[];
  @ApiProperty({
    description: "나를 팔로우하는 유저의 수",
    type: Number,
  })
  count: number;

  constructor(followerUsers: User[]) {
    this.followers = followerUsers.map((user) => new UserInfoDto(user));
    this.count = this.followers.length;
  }
}
