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
  "likeCount",
] as const) {
  static fromModel(model: Post) {
    return plainToClass(PostMetadataInfoDto, model, {
      excludeExtraneousValues: true,
    });
  }

  static fromJson(json: Record<any, any>) {
    return plainToClass(PostMetadataInfoDto, json, {
      excludeExtraneousValues: true,
    });
  }
}
