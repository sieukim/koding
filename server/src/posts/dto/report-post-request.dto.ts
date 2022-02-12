import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ReportPostRequestDto {
  @IsString()
  @ApiProperty({
    description: "신고 사유",
  })
  reportReason: string;
}
