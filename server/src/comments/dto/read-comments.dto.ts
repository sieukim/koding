import { ApiProperty } from "@nestjs/swagger";
import { Comment } from "../../entities/comment.entity";
import { CommentWithWriterInfoDto } from "./comment-with-writer-info.dto";
import { Fetched } from "../../common/types/fetched.type";
import { WithNextCursorDto } from "../../common/dto/with-next-cursor.dto";

export class ReadCommentsDto extends WithNextCursorDto {
  @ApiProperty({
    description: "게시글의 댓글들",
    type: [CommentWithWriterInfoDto],
  })
  comments: CommentWithWriterInfoDto[];

  constructor(
    comments: (Fetched<Comment, "writer"> & { liked: boolean })[],
    nextPageCursor?: string,
  ) {
    super();
    this.nextPageCursor = nextPageCursor;
    this.comments = comments.map(CommentWithWriterInfoDto.fromJson);
  }
}
