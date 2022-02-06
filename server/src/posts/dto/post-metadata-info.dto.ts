import { PickType } from "@nestjs/swagger";
import { Post } from "../../models/post.model";
import { plainToClass } from "class-transformer";

export class PostMetadataInfoDto extends PickType(Post, [
  "postId",
  "title",
  "writerNickname",
  "tags",
  "createdAt",
  "boardType",
  "markdownContent",
  "imageUrls",
  "readCount",
  "likeCount",
  "commentCount",
  "scrapCount",
] as const) {
  static fromModel(model: Post) {
    return PostMetadataInfoDto.fromJson(model);
  }

  static fromJson(json: Readonly<PostMetadataInfoDto>) {
    return plainToClass(PostMetadataInfoDto, json, {
      excludeExtraneousValues: true,
    });
  }
}
