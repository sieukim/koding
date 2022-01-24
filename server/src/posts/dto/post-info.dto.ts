import { PickType } from "@nestjs/swagger";
import { Post } from "../../models/post.model";
import { plainToClass } from "class-transformer";

export class PostInfoDto extends PickType(Post, [
  "postId",
  "title",
  "markdownContent",
  "tags",
  "readCount",
  "boardType",
  "createdAt",
  "imageUrls",
  "writerNickname",
] as const) {
  static fromModel(model: Post) {
    return plainToClass(PostInfoDto, model, { excludeExtraneousValues: true });
  }
}
