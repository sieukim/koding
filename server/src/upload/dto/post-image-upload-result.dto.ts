import { ApiProperty } from "@nestjs/swagger";

export class PostImageUploadResultDto {
  @ApiProperty({
    description: "업로드 파일의 URL. 게시글 등록 시 필요",
  })
  imageUrl: string;

  constructor(imageUrl: string) {
    this.imageUrl = imageUrl;
  }
}
