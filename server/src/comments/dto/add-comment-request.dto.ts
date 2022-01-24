import { PickType } from "@nestjs/swagger";
import { Comment } from "../../models/comment.model";

export class AddCommentRequestDto extends PickType(Comment, [
  "content",
  "mentionedNicknames",
] as const) {}
