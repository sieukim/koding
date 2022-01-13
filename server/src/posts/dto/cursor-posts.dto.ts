import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { ReadPostMetadataDto } from "./read-post-metadata.dto";
import { Post } from "../../models/post.model";

export class CursorPostsDto {
  @ApiProperty({
    description: "게시글 리스트",
    type: [ReadPostMetadataDto],
  })
  posts: ReadPostMetadataDto[];

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description:
      "다음 페이지를 가져오기 위한 커서 query 값. 마지막 페이지인 경우는 값 없음",
    example: "61d7238b7d7a9ad823c8d8a9",
  })
  nextPageCursor?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description:
      "이전 페이지를 가져오기 위한 커서 query 값. 첫 페이지인 경우는 값 없음",
    example: "61d7238b7d7a9ad823c8d8a9",
  })
  prevPageCursor?: string;

  constructor(posts: Post[], prevPageCursor?: string, nextPageCursor?: string) {
    this.prevPageCursor = prevPageCursor;
    this.nextPageCursor = nextPageCursor;
    this.posts = posts.map((post) => new ReadPostMetadataDto(post));
  }
}
