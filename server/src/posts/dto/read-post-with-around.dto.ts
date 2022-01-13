import { ReadPostMetadataDto } from "./read-post-metadata.dto";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ReadPostWithWriterDto } from "./read-post-with-writer.dto";
import { Post } from "../../models/post.model";
import { User } from "../../models/user.model";

export class ReadPostWithAroundDto {
  @ApiProperty({
    description: "현재 게시글 정보",
  })
  post: ReadPostWithWriterDto;
  @ApiPropertyOptional({
    description: "이전 게시글의 간략한 정보, 이전 게시글이 없는 경우엔 값 없음",
  })
  prevPostInfo?: ReadPostMetadataDto;
  @ApiPropertyOptional({
    description: "다음 게시글의 간략한 정보, 다음 게시글이 없는 경우엔 값 없음",
  })
  nextPostInfo?: ReadPostMetadataDto;

  constructor(post: Post & { writer: User }, prevPost?: Post, nextPost?: Post) {
    this.prevPostInfo = prevPost
      ? new ReadPostMetadataDto(prevPost)
      : undefined;
    this.nextPostInfo = nextPost
      ? new ReadPostMetadataDto(nextPost)
      : undefined;
    this.post = new ReadPostWithWriterDto(post, post.writer);
  }
}
