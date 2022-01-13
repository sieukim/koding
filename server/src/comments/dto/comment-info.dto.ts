import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsArray, IsString } from "class-validator";
import { Comment } from "../../models/comment.model";

export class CommentInfoDto extends PickType(Comment, [
  "commentId",
  "content",
  "postId",
  "writerNickname",
  "createdAt",
] as const) {
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    description: "댓글에서 멘션하는 유저들의 닉네임",
  })
  mentionedNicknames: string[];

  constructor(comment: Comment) {
    super();
    this.commentId = comment.commentId;
    this.postId = comment.postId;
    this.content = comment.content;
    this.createdAt = comment.createdAt;
    this.writerNickname = comment.writerNickname;
    this.mentionedNicknames = comment.mentionedUsers.map(
      (mention) => mention.nickname,
    );
  }
}
