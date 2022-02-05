import { PickType } from "@nestjs/swagger";
import { Post } from "../../models/post.model";
import { Expose, plainToClass } from "class-transformer";

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
  /*
   * 게시글에 대한 사용자의 좋아요 여부.
   */
  @Expose()
  liked?: boolean;

  static fromModel(model: Post) {
    return plainToClass(PostInfoDto, model, { excludeExtraneousValues: true });
  }
}
