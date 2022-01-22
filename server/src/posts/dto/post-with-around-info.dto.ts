import { PostMetadataInfoDto } from "./post-metadata-info.dto";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PostWithWriterInfoDto } from "./post-with-writer-info.dto";
import { Post } from "../../models/post.model";
import { User } from "../../models/user.model";

export class PostWithAroundInfoDto {
  @ApiProperty({
    description: "현재 게시글 정보",
  })
  post: PostWithWriterInfoDto;
  @ApiPropertyOptional({
    description: "이전 게시글의 간략한 정보, 이전 게시글이 없는 경우엔 값 없음",
  })
  prevPostInfo?: PostMetadataInfoDto;
  @ApiPropertyOptional({
    description: "다음 게시글의 간략한 정보, 다음 게시글이 없는 경우엔 값 없음",
  })
  nextPostInfo?: PostMetadataInfoDto;

  constructor(post: Post & { writer: User }, prevPost?: Post, nextPost?: Post) {
    this.prevPostInfo = prevPost
      ? new PostMetadataInfoDto(prevPost)
      : undefined;
    this.nextPostInfo = nextPost
      ? new PostMetadataInfoDto(nextPost)
      : undefined;
    this.post = new PostWithWriterInfoDto(post, post.writer);
  }
}
