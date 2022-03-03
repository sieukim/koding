import { PickType } from "@nestjs/swagger";
import { Comment } from "../../entities/comment.entity";

export class AddCommentRequestDto extends PickType(Comment, [
  "content",
  "mentionedNicknames",
] as const) {}
