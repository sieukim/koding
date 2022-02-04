import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CursorQueryDto {
  @IsOptional()
  @ApiProperty({
    description:
      "다음 페이지를 가져오기 위한 커서. 첫 페이지를 가져오는 경우 값을 넣지 않음",
    type: String,
    required: false,
  })
  cursor?: string;
}
