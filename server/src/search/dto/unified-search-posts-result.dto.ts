import { PostMetadataInfoDto } from "src/posts/dto/post-metadata-info.dto";
import { ApiProperty } from "@nestjs/swagger";
import { ArrayMaxSize, IsNumber, Min } from "class-validator";
import { Expose, plainToClass } from "class-transformer";
import { PostBoardType } from "../../entities/post-board.type";

export class SearchPostResultDto {
  @Expose()
  @ArrayMaxSize(5)
  @ApiProperty({
    description: "요약된 검색 결과.",
  })
  posts: PostMetadataInfoDto[];

  @Expose()
  @Min(0)
  @IsNumber()
  @ApiProperty({
    description: "조건에 맞는 총 게시글 수",
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
  community: SearchPostResultDto;
  @Expose()
  blog: SearchPostResultDto;
  @Expose()
  qna: SearchPostResultDto;
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
