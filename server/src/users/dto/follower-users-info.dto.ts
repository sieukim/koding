import { User } from "../../entities/user.entity";
import { UserInfoDto } from "./user-info.dto";
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
    this.followers = followerUsers.map(UserInfoDto.fromModel);
    this.count = this.followers.length;
  }
}
