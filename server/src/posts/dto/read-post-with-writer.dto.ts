import { ReadPostDto } from "./read-post.dto";
import { Post } from "../../schemas/post.schema";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { LoginResultDto } from "../../auth/dto/login-result.dto";
import { User } from "../../schemas/user.schema";

export class ReadPostWithWriterDto extends ReadPostDto {
  @ApiPropertyOptional({
    description: "작성자 정보"
  })
  writer: LoginResultDto;

  constructor(post: Post, writer: User) {
    super(post);
    this.writer = new LoginResultDto(writer);
  }
}