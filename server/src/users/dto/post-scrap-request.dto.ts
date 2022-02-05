import { PickType } from "@nestjs/swagger";
import { Post } from "../../models/post.model";

export class PostScrapRequestDto extends PickType(Post, [
  "postId",
  "boardType",
] as const) {}
