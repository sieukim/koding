import { IsNumber, Max, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class PageSizeQueryDto {
  @Min(1)
  @Max(30)
  @IsNumber()
  @ApiProperty({
    description: "페이지당 개수",
    type: Number,
  })
  pageSize?: number = 10;
}
