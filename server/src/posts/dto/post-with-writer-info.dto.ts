import { PostInfoDto } from "./post-info.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { UserInfoDto } from "../../users/dto/user-info.dto";
import { Post } from "../../models/post.model";
import { User } from "../../models/user.model";

export class PostWithWriterInfoDto extends PostInfoDto {
  @ApiPropertyOptional({
    description: "작성자 정보",
  })
  writer: UserInfoDto;

  constructor(post: Post, writer: User) {
    super(post);
    this.writer = new UserInfoDto(writer);
  }
}
