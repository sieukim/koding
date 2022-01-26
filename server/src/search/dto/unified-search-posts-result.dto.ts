import { PostMetadataInfoDto } from "src/posts/dto/post-metadata-info.dto";
import { PostBoardType } from "../../models/post.model";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, MaxLength, Min } from "class-validator";
import { Expose, plainToClass } from "class-transformer";

export class SearchPostResultDto {
  @Expose()
  @MaxLength(5)
  @ApiProperty({
    description: "요약된 검색 결과.",
  })
  posts: PostMetadataInfoDto[];
  @Expose()
  @Min(0)
  @IsNumber()
  @ApiProperty({
    description: "총 검색 결과 수",
  })
  totalCount: number;
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
