import { PickType } from "@nestjs/swagger";
import { Post } from "../../entities/post.entity";

export class WritePostRequestDto extends PickType(Post, [
  "title",
  "markdownContent",
  "htmlContent",
  "tags",
  "imageUrls",
] as const) {}
