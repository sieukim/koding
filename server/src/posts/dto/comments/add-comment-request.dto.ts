import { ApiProperty, PickType } from "@nestjs/swagger";
import { Comment } from "../../../schemas/post.schema";
import { IsArray, IsString } from "class-validator";


export class AddCommentRequestDto extends PickType(Comment, ["content"]) {
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    description: "댓글에서 멘션하는 유저들의 닉네임"
  })
  mentionedNicknames: string[];
}