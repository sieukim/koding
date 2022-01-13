import { CommentInfoDto } from "./comment-info.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Comment } from "../../models/comment.model";

export class ReadCommentDto {
  @ApiProperty({
    description: "게시글의 댓글들",
    type: [CommentInfoDto],
  })
  comments: CommentInfoDto[];
  @ApiProperty({
    description: "댓글의 수",
    type: Number,
    minimum: 0,
  })
  count: number;

  constructor(comments: Comment[]) {
    this.comments = comments.map((comment) => new CommentInfoDto(comment));
    this.count = this.comments.length;
  }
}
