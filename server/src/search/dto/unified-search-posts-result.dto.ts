import { PostMetadataInfoDto } from "src/posts/dto/post-metadata-info.dto";
import { PostBoardType } from "../../models/post.model";
import { ApiProperty } from "@nestjs/swagger";
import { ArrayMaxSize } from "class-validator";
import { Expose, plainToClass } from "class-transformer";
import { PostListDto } from "../../posts/dto/post-list.dto";

export class SearchPostResultDto extends PostListDto {
  @Expose()
  @ArrayMaxSize(5)
  @ApiProperty({
    description: "요약된 검색 결과.",
  })
  posts: PostMetadataInfoDto[];
}

export class UnifiedSearchPostsResultDto
  implements Record<PostBoardType, SearchPostResultDto>
{
  @Expose()
  "study-group": SearchPostResultDto;
  @Expose()
  career: SearchPostResultDto;
  @Expose()
  column: SearchPostResultDto;
  @Expose()
  common: SearchPostResultDto;
  @Expose()
  question: SearchPostResultDto;
  @Expose()
  recruit: SearchPostResultDto;

  static fromJson(
    json: Record<
      PostBoardType,
      { posts: PostMetadataInfoDto[]; totalCount: number }
    >,
  ) {
    return plainToClass(UnifiedSearchPostsResultDto, json, {
      excludeExtraneousValues: true,
    });
  }
}
