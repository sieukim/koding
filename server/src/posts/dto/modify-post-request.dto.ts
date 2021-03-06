import { ApiPropertyOptional, PartialType, PickType } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { Post } from "../../entities/post.entity";

export class ModifyPostRequestDto extends PartialType(
  PickType(Post, [
    "title",
    "markdownContent",
    "tags",
    "imageUrls",
    "htmlContent",
  ] as const),
) {
  @ApiPropertyOptional({
    description: "바꿀 제목. 그대로 둘 경우엔 기재하지 않음",
  })
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: "바꿀 내용의 마크다운 버전. 바꾸지 않을 경우 사용하지 않음",
  })
  @IsOptional()
  markdownContent?: string;

  @ApiPropertyOptional({
    description: "바꿀 내용의 html 버전. 바꾸지 않을 경우 사용하지 않음",
  })
  @IsOptional()
  htmlContent?: string;

  @ApiPropertyOptional({
    description: "바꿀 태그들. 전체를 바꿈  바꾸지 않을 경우 사용하지 않음",
  })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({
    description:
      "바꿀 내용에 있는 이미지 url들. 바꾸지 않을 경우 사용하지 않음",
    type: [String],
  })
  imageUrls?: string[];
}
