import { PickType } from "@nestjs/swagger";
import { Post } from "../../models/post.model";
import { plainToClass } from "class-transformer";

export class PostInfoDto extends PickType(Post, [
  "postId",
  "title",
  "markdownContent",
  "tags",
  "boardType",
  "createdAt",
  "imageUrls",
  "writerNickname",
  "likeCount",
  "readCount",
  "commentCount",
  "scrapCount",
] as const) {
  static fromModel(model: Post) {
    return plainToClass(PostInfoDto, model, { excludeExtraneousValues: true });
  }
}
