import { PickType } from "@nestjs/swagger";
import { Comment } from "../../models/comment.model";
import { plainToClass } from "class-transformer";

export class MyCommentInfoDto extends PickType(Comment, [
  "commentId",
  "content",
  "postId",
  "boardType",
  "writerNickname",
  "createdAt",
  "mentionedNicknames",
  "likeCount",
  "post",
] as const) {
  static fromModel(model: Comment) {
    return plainToClass(MyCommentInfoDto, model, {
      excludeExtraneousValues: true,
    });
  }
}
