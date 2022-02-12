import { IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class WithPrevCursorDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description:
      "이전 페이지를 가져오기 위한 커서 query 값. 첫 페이지인 경우는 값 없음",
  })
  prevPageCursor?: string;
}
