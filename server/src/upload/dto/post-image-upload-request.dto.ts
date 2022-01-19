import { ApiProperty } from "@nestjs/swagger";

export class PostImageUploadRequestDto {
  @ApiProperty({ type: String, format: "binary" })
  image: any;
}
