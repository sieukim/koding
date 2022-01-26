import { PickType } from "@nestjs/swagger";
import { Post } from "../../models/post.model";

export class WritePostRequestDto extends PickType(Post, [
  "title",
  "markdownContent",
  "htmlContent",
  "tags",
  "imageUrls",
] as const) {}
