import { ReadPostDto } from "./read-post.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { UserInfoDto } from "../../auth/dto/user-info.dto";
import { Post } from "../../models/post.model";
import { User } from "../../models/user.model";

export class ReadPostWithWriterDto extends ReadPostDto {
  @ApiPropertyOptional({
    description: "작성자 정보",
  })
  writer: UserInfoDto;

  constructor(post: Post, writer: User) {
    super(post);
    this.writer = new UserInfoDto(writer);
  }
}