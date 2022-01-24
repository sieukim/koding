import { PickType } from "@nestjs/swagger";
import { Comment } from "../../models/comment.model";
import { plainToClass } from "class-transformer";

export class CommentInfoDto extends PickType(Comment, [
  "commentId",
  "content",
  "postId",
  "writerNickname",
  "createdAt",
  "mentionedNicknames",
] as const) {
  static fromModel(model: Comment) {
    return plainToClass(CommentInfoDto, model, {
      excludeExtraneousValues: true,
    });
  }
}
