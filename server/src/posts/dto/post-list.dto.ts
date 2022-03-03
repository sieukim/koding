import { ApiProperty } from "@nestjs/swagger";
import { Post } from "../../entities/post.entity";
import { Expose, plainToClass } from "class-transformer";
import { IsNumber, Min } from "class-validator";
import { PostWithWriterInfoDto } from "./post-with-writer-info.dto";

export class PostListDto {
  @Expose()
  @ApiProperty({
    description: "게시글 리스트",
    type: [PostWithWriterInfoDto],
  })
  posts: PostWithWriterInfoDto[];

  @Expose()
  @Min(0)
  @IsNumber()
  @ApiProperty({
    description: "조건에 맞는 총 게시글 수",
  })
  totalCount: number;

  static fromModel(models: Post[], totalCount: number) {
    return plainToClass(
      PostListDto,
      { posts: models.map(PostWithWriterInfoDto.fromModel), totalCount },
      { excludeExtraneousValues: true },
    );
  }
}
