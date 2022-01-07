import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsUrl } from "class-validator";
import { ReadPostMetadataDto } from "./read-post-metadata.dto";
import { Post } from "../../../schemas/post.schema";

export class CursorPostsDto {
  @ApiProperty({
    description: "게시글 리스트",
    type: [ReadPostMetadataDto]
  })
  posts: ReadPostMetadataDto[];
  @IsOptional()
  @IsUrl({ require_host: false })
  @ApiPropertyOptional({
    description: "다음 페이지를 가져오는 요청 url. 마지막 페이지인 경우는 값 없음",
    example: "/api/posts/common?cursor=61d7238b7d7a9ad823c8d8a9"
  })
  nextPageUrl?: string;

  // @IsOptional()
  // @IsUrl({require_host:false})
  // @ApiPropertyOptional({
  //   description:"이전 페이지를 가져오는 요청 url. 첫 페이지인 경우는 값 없음",
  //   example:"/api/posts/common?cursor=61d7238b7d7a9ad823c8d8a9"
  // })
  // prevPageUrl?:string;

  constructor(posts: Post[], nextPageUrl?: string) {
    this.nextPageUrl = nextPageUrl;
    this.posts = posts.map(post => new ReadPostMetadataDto(post));
  }
}