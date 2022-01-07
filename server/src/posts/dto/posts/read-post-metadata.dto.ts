import { ApiProperty, PickType } from "@nestjs/swagger";
import { Post } from "../../../schemas/post.schema";

const keys = ["title", "readCount", "tags", "createdAt", "boardType"] as const;

export class ReadPostMetadataDto extends PickType(Post, keys) {
  @ApiProperty({
    description: "게시글의 고유 아이디"
  })
  postId: string;

  @ApiProperty({
    description: "게시글 작성자 닉네임"
  })
  writerNickname: string;

  constructor(post: Post) {
    super();
    for (const key in post) {
      // @ts-ignore
      if (keys.includes(key))
        this[key] = post[key];
    }
    this.postId = post._id.toString();
    this.writerNickname = post.writer.nickname;
  }

}