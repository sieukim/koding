import { ApiPropertyOptional, PartialType, PickType } from "@nestjs/swagger";
import { Post } from "../../../schemas/post.schema";
import { IsOptional } from "class-validator";

const keys = ["title", "markdownContent", "tags"] as const;

export class ModifyPostRequestDto extends PartialType(PickType(Post, keys)) {
  @ApiPropertyOptional({
    description: "바꿀 제목. 그대로 둘 경우엔 기재하지 않음"
  })
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: "바꿀 내용. 바꾸지 않을 경우 사용하지 않음"
  })
  @IsOptional()
  markdownContent?: string;

  @ApiPropertyOptional({
    description: "바꿀 태그들. 전체를 바꿈  바꾸지 않을 경우 사용하지 않음"
  })
  @IsOptional()
  tags?: string[];
}