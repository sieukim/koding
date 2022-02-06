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
   * 게시글에 대한 사용자의 좋아요 여부. 로그인한 사용자가 없을 경우엔 false
   */
  @Expose()
  liked?: boolean = false;

  /*
   * 게시글에 대한 사용자의 스크랩 여부. 로그인한 사용자가 없을 경우엔 false
   */
  @Expose()
  scraped?: boolean = false;

  static fromModel(model: Post) {
    return plainToClass(PostInfoDto, model, { excludeExtraneousValues: true });
  }
}
