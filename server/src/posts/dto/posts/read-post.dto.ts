import { ApiProperty, PickType } from "@nestjs/swagger";
import { Post } from "../../../schemas/post.schema";
import { ReadCommentDto } from "../comments/read-comment.dto";

const keys = ([
  "title",
  "markdownContent",
  "tags",
  "readCount",
  "boardType",
  "createdAt"
]) as const;

export class ReadPostDto extends PickType(Post, keys) {
  @ApiProperty({
    description: "게시글의 고유 아이디"
  })
  postId: string;

  @ApiProperty({
    description: "게시글의 댓글",
    type: [ReadCommentDto]
  })
  comments: ReadCommentDto[];

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
    this.comments = post.comments.map((comment) => new ReadCommentDto(comment));
    this.postId = post._id.toString();
    this.writerNickname = post.writer.nickname;
  }

}