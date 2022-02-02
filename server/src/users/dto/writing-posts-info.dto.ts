import { PostBoardType } from "../../models/post.model";
import { PostInfoDto } from "../../posts/dto/post-info.dto";
import { Expose, plainToClass, Type } from "class-transformer";

export class WritingPostsInfoDto
  implements Record<PostBoardType, PostInfoDto[]>
{
  @Type(() => PostInfoDto)
  @Expose()
  "study-group": PostInfoDto[];
  @Type(() => PostInfoDto)
  @Expose()
  career: PostInfoDto[];
  @Type(() => PostInfoDto)
  @Expose()
  column: PostInfoDto[];
  @Type(() => PostInfoDto)
  @Expose()
  common: PostInfoDto[];
  @Type(() => PostInfoDto)
  @Expose()
  question: PostInfoDto[];
  @Type(() => PostInfoDto)
  @Expose()
  recruit: PostInfoDto[];

  static fromJson(json: Record<PostBoardType, PostInfoDto[]>) {
    return plainToClass(WritingPostsInfoDto, json, {
      excludeExtraneousValues: true,
    });
  }
}
