import { ApiHideProperty, ApiProperty, PickType } from "@nestjs/swagger";
import { User } from "../../models/user.model";
import { Exclude } from "class-transformer";

export class SignupLocalRequestDto extends PickType(User, [
  "email",
  "password",
  "nickname",
  "blogUrl",
  "githubUrl",
  "portfolioUrl",
]) {
  @ApiProperty({
    type: String,
    format: "binary",
  })
  avatar?: any;

  @Exclude()
  @ApiHideProperty()
  avatarUrl: string;
}
