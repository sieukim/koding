import { PickType } from "@nestjs/swagger";
import { Comment } from "../../models/comment.model";
import { Expose, plainToClass } from "class-transformer";

export class CommentInfoDto extends PickType(Comment, [
  "commentId",
  "content",
  "postId",
  "boardType",
  "writerNickname",
  "createdAt",
  "mentionedNicknames",
  "likeCount",
] as const) {
  /*
   * 댓글에 대한 사용자의 좋아요 여부. 로그인한 사용자가 없을 경우엔 false
   */
  @Expose()
  liked?: boolean = false;

  static fromModel(model: Comment) {
    return plainToClass(CommentInfoDto, model, {
      excludeExtraneousValues: true,
    });
  }
}
