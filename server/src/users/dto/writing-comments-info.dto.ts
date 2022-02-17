import { Comment } from "../../models/comment.model";
import { MyCommentInfoDto } from "../../comments/dto/my-comment-info.dto";

export class WritingCommentsInfoDto {
  /*
   * 사용자가 작성한 댓글 리스트
   */
  comments: MyCommentInfoDto[];

  /*
   * 다음 페이지를 가져오기 위한 커서 query 값. 마지막 페이지인 경우는 값 없음
   */
  nextPageCursor?: string;

  constructor(comments: Comment[], nextPageCursor?: string) {
    this.comments = comments.map(MyCommentInfoDto.fromModel);
    this.nextPageCursor = nextPageCursor;
  }
}
