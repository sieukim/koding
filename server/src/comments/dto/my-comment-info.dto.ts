import { ApiProperty, PickType } from "@nestjs/swagger";
import { Comment } from "../../models/comment.model";
import { Expose, plainToClass, Transform } from "class-transformer";
import { PostInfoDto } from "../../posts/dto/post-info.dto";

export class MyCommentInfoDto extends PickType(Comment, [
  "commentId",
  "content",
  "postId",
  "boardType",
  "writerNickname",
  "createdAt",
  "mentionedNicknames",
  "likeCount",
] as const) {
  @Transform(({ value }) => value && PostInfoDto.fromModel(value), {
    toClassOnly: true,
  })
  @Expose()
  @ApiProperty({
    description: "댓글의 게시글 정보",
    type: PostInfoDto,
  })
  post: PostInfoDto;

  static fromModel(model: Comment) {
    return plainToClass(MyCommentInfoDto, model, {
      excludeExtraneousValues: true,
    });
  }
}
