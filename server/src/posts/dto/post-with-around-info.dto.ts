import { PostMetadataInfoDto } from "./post-metadata-info.dto";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Post } from "../../models/post.model";
import { PostReadInfoDto } from "./post-read-info.dto";

export class PostWithAroundInfoDto {
  @ApiProperty({
    description: "현재 게시글 정보",
  })
  post: PostReadInfoDto;
  @ApiPropertyOptional({
    description: "이전 게시글의 간략한 정보, 이전 게시글이 없는 경우엔 값 없음",
  })
  prevPostInfo?: PostMetadataInfoDto;
  @ApiPropertyOptional({
    description: "다음 게시글의 간략한 정보, 다음 게시글이 없는 경우엔 값 없음",
  })
  nextPostInfo?: PostMetadataInfoDto;

  constructor(
    post: Post,
    liked: boolean,
    scrapped: boolean,
    reported: boolean,
    prevPost?: Post,
    nextPost?: Post,
  ) {
    this.prevPostInfo = prevPost
      ? PostMetadataInfoDto.fromModel(prevPost)
      : undefined;
    this.nextPostInfo = nextPost
      ? PostMetadataInfoDto.fromModel(nextPost)
      : undefined;
    this.post = PostReadInfoDto.fromJson({
      ...post,
      liked,
      scrapped,
      reported,
    });
  }
}
