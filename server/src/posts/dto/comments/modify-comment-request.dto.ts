import { ApiPropertyOptional, PartialType, PickType } from "@nestjs/swagger";
import { Comment } from "../../../schemas/post.schema";
import { IsArray, IsOptional, IsString } from "class-validator";


export class ModifyCommentRequestDto extends PartialType(PickType(Comment, ["content"] as const)) {

  @ApiPropertyOptional({
    description: "바꿀 내용. 바꾸지 않을 경우 사용하지 않음"
  })
  @IsOptional()
  content?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiPropertyOptional({
    description: "댓글에서 멘션하는 유저들의 닉네임"
  })
  mentionedNicknames?: string[];
}