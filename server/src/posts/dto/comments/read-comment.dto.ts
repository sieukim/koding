import { ApiProperty, PickType } from "@nestjs/swagger";
import { Comment } from "../../../schemas/post.schema";
import { IsArray, IsString } from "class-validator";


export class ReadCommentDto extends PickType(Comment, ["content", "createdAt"]) {
  @IsString()
  @ApiProperty({
    description: "댓글의 아이디"
  })
  commentId;
  @IsString()
  @ApiProperty({
    description: "작성자 닉네임"
  })
  writerNickname: string;
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    description: "댓글에서 멘션하는 유저들의 닉네임"
  })
  mentionedNicknames: string[];

  constructor(comment: Comment) {
    super();
    this.commentId = comment._id;
    this.content = comment.content;
    this.createdAt = comment.createdAt;
    this.writerNickname = comment.writer.nickname;
    this.mentionedNicknames = comment.mentionedUsers.map(mention => mention.nickname);
  }
}