import { CommentInfoDto } from "./comment-info.dto";
import { Expose, plainToClass, Transform } from "class-transformer";
import { UserInfoDto } from "../../users/dto/user-info.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Comment } from "../../entities/comment.entity";

export class CommentWithWriterInfoDto extends CommentInfoDto {
  @Transform(({ value }) => value && UserInfoDto.fromModel(value), {
    toClassOnly: true,
  })
  @Expose()
  @ApiPropertyOptional({
    description: "작성자 정보. 탈퇴한 사용자인 경우 null",
  })
  writer: UserInfoDto | null;

  static fromModel(comment: Comment) {
    return plainToClass(CommentWithWriterInfoDto, comment, {
      excludeExtraneousValues: true,
    });
  }

  static fromJson(json: Readonly<CommentWithWriterInfoDto>) {
    return plainToClass(CommentWithWriterInfoDto, json, {
      excludeExtraneousValues: true,
    });
  }
}
