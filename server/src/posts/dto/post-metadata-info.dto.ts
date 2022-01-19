import { ApiProperty, PickType } from "@nestjs/swagger";
import { Post } from "../../models/post.model";

const keys = [
  "postId",
  "title",
  "readCount",
  "tags",
  "createdAt",
  "boardType",
] as const;

export class PostMetadataInfoDto extends PickType(Post, keys) {
  @ApiProperty({
    description: "게시글 작성자 닉네임",
  })
  writerNickname: string;

  constructor(post: Post) {
    super();
    for (const key in post) {
      if ((keys as readonly (keyof Post)[]).includes(key as keyof Post))
        this[key] = post[key];
    }
    this.writerNickname = post.writer.nickname;
  }
}
