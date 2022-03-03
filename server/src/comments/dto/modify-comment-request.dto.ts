import { ApiPropertyOptional, PartialType, PickType } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { Comment } from "../../entities/comment.entity";

export class ModifyCommentRequestDto extends PartialType(
  PickType(Comment, ["content", "mentionedNicknames"] as const),
) {
  @IsOptional()
  @ApiPropertyOptional({
    description: "바꿀 내용. 바꾸지 않을 경우 사용하지 않음",
  })
  content?: string;

  @IsOptional()
  @ApiPropertyOptional({
    description: "댓글에서 멘션하는 유저들의 닉네임",
  })
  mentionedNicknames?: string[];
}
