import { ApiProperty, PickType } from "@nestjs/swagger";
import { User } from "../../schemas/user.schema";

export class FollowUserDto extends PickType(User, ["nickname"]) {

  @ApiProperty({
    description: "팔로우할 유저 닉네임",
    example: "testNick2"
  })
  nickname: string;
}