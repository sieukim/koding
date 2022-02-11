import { PostWithWriterInfoDto } from "./post-with-writer-info.dto";
import { Expose, plainToClass, Type } from "class-transformer";

export class PostReadInfoDto extends PostWithWriterInfoDto {
  /*
   * 게시글에 대한 사용자의 좋아요 여부. 로그인한 사용자가 없을 경우엔 false
   */
  @Expose()
  @Type(() => Boolean)
  liked?: boolean = false;

  /*
   * 게시글에 대한 사용자의 스크랩 여부. 로그인한 사용자가 없을 경우엔 false
   */
  @Expose()
  @Type(() => Boolean)
  scrapped?: boolean = false;

  static fromJson(json: Readonly<PostReadInfoDto>) {
    console.log(`postReadInfo.fromJson: json: ${JSON.stringify(json)}`);
    return plainToClass(PostReadInfoDto, json, {
      excludeExtraneousValues: true,
    });
  }
}
