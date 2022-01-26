import { PostListDto } from "../../posts/dto/post-list.dto";
import { Post } from "../../models/post.model";
import { PostMetadataInfoDto } from "../../posts/dto/post-metadata-info.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, Min } from "class-validator";

export class SearchPostResultWithCursorDto extends PostListDto {
  @Min(0)
  @IsNumber()
  @ApiProperty({
    description: "총 검색 결과 수",
  })
  totalCount: number;

  constructor(
    posts: Post[] | PostMetadataInfoDto[],
    totalCount: number,
    prevPageCursor?: string,
    nextPageCursor?: string,
  ) {
    super(posts, prevPageCursor, nextPageCursor);
    this.totalCount = totalCount;
  }
}
