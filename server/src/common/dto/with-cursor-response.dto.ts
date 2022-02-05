import { IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class WithCursorResponseDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description:
      "다음 페이지를 가져오기 위한 커서 query 값. 마지막 페이지인 경우는 값 없음",
    example: "61d7238b7d7a9ad823c8d8a9",
  })
  nextPageCursor?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description:
      "이전 페이지를 가져오기 위한 커서 query 값. 첫 페이지인 경우는 값 없음",
    example: "61d7238b7d7a9ad823c8d8a9",
  })
  prevPageCursor?: string;
}
