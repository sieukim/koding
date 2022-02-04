import { Max, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class PageSizeQueryDto {
  @Min(1)
  @Max(30)
  @ApiProperty({
    description: "페이지당 개수",
    type: Number,
  })
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  pageSize?: number = 10;
}
