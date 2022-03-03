import { PostInfoDto } from "./post-info.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { UserInfoDto } from "../../users/dto/user-info.dto";
import { Post } from "../../entities/post.entity";
import { Expose, plainToClass, Transform } from "class-transformer";

export class PostWithWriterInfoDto extends PostInfoDto {
  @Transform(({ value }) => value && UserInfoDto.fromModel(value), {
    toClassOnly: true,
  })
  @Expose()
  @ApiPropertyOptional({
    description: "작성자 정보. 탈퇴한 사용자인 경우 null",
    type: UserInfoDto,
  })
  writer: UserInfoDto | null;

  static fromModel(post: Post) {
    return plainToClass(PostWithWriterInfoDto, post, {
      excludeExtraneousValues: true,
    });
  }
}
