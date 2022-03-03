import { ApiProperty, PickType } from "@nestjs/swagger";
import { User } from "../../entities/user.entity";

export class FollowUserDto extends PickType(User, ["nickname"]) {
  @ApiProperty({
    description: "팔로우할 사용자 닉네임",
    example: "testNick2",
  })
  nickname: string;
}
