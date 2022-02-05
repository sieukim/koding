import { ApiProperty } from "@nestjs/swagger";
import { PostMetadataInfoDto } from "./post-metadata-info.dto";
import { Post } from "../../models/post.model";
import { plainToClass } from "class-transformer";
import { IsNumber, Min } from "class-validator";

export class PostListDto {
  @ApiProperty({
    description: "게시글 리스트",
    type: [PostMetadataInfoDto],
  })
  posts: PostMetadataInfoDto[];

  @Min(0)
  @IsNumber()
  @ApiProperty({
    description: "조건에 맞는 총 게시글 수",
  })
  totalCount: number;

  static fromModel(models: Post[], totalCount: number) {
    return plainToClass(
      PostListDto,
      { posts: models.map(PostMetadataInfoDto.fromModel), totalCount },
      { excludeExtraneousValues: true },
    );
  }
}
