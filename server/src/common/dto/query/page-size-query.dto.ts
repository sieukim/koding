import { Max, Min } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class PageSizeQueryDto {
  @Min(1)
  @Max(30)
  @ApiPropertyOptional({
    description: "페이지당 개수",
    type: Number,
    default: 10,
  })
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  pageSize: number = 10;
}
