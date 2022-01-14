import { ApiProperty } from "@nestjs/swagger";
import { ArrayUnique, IsArray, IsString } from "class-validator";

export class AddCertifiedTagsRequestDto {
  @IsString({ each: true })
  @IsArray()
  @ArrayUnique()
  @ApiProperty({
    description: "인증된 태그로 추가할 태그 배열",
    type: [String],
  })
  tags: string[];
}
