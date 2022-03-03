import { PickType } from "@nestjs/swagger";
import { Post } from "../../entities/post.entity";

export class PostScrapRequestDto extends PickType(Post, [
  "postId",
  "boardType",
] as const) {}
