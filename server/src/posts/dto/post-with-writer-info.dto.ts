import { PostInfoDto } from "./post-info.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { UserInfoDto } from "../../users/dto/user-info.dto";
import { Post } from "../../models/post.model";
import { User } from "../../models/user.model";
import { Expose, plainToClass, Transform } from "class-transformer";

export class PostWithWriterInfoDto extends PostInfoDto {
  @Transform(
    ({ value }: { value?: User }) =>
      value ? UserInfoDto.fromModel(value) : undefined,
    {
      toClassOnly: true,
    },
  )
  @Expose()
  @ApiPropertyOptional({
    description: "작성자 정보. 탈퇴한 사용자인 경우 값 없음",
  })
  writer?: UserInfoDto;

  static fromModel(post: Post) {
    return plainToClass(PostWithWriterInfoDto, post, {
      excludeExtraneousValues: true,
    });
  }
}
