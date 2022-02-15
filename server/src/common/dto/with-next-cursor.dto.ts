import { IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class WithNextCursorDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description:
      "다음 페이지를 가져오기 위한 커서 query 값. 마지막 페이지인 경우는 값 없음",
  })
  nextPageCursor?: string;
}
