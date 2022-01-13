import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsArray, IsString } from "class-validator";
import { Comment } from "../../models/comment.model";

export class AddCommentRequestDto extends PickType(Comment, [
  "content",
] as const) {
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    description: "댓글에서 멘션하는 유저들의 닉네임",
  })
  mentionedNicknames: string[];
}
