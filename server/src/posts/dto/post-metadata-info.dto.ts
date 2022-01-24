import { PickType } from "@nestjs/swagger";
import { Post } from "../../models/post.model";
import { plainToClass } from "class-transformer";

export class PostMetadataInfoDto extends PickType(Post, [
  "postId",
  "title",
  "readCount",
  "tags",
  "createdAt",
  "boardType",
  "writerNickname",
] as const) {
  static fromModel(model: Post) {
    return plainToClass(PostMetadataInfoDto, model, {
      excludeExtraneousValues: true,
    });
  }
}
