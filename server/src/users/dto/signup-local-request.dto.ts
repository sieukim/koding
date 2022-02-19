import { ApiHideProperty, ApiProperty, PickType } from "@nestjs/swagger";
import { User } from "../../models/user.model";
import { Exclude } from "class-transformer";
import { IsOptional } from "class-validator";
import { StringToStringArrayTransform } from "../../common/decorator/string-to-string-array-transform.decorator";

export class SignupLocalRequestDto extends PickType(User, [
  "email",
  "password",
  "nickname",
  "blogUrl",
  "githubUrl",
  "portfolioUrl",
  "interestTech",
  "techStack",
]) {
  @ApiProperty({
    type: String,
    format: "binary",
  })
  avatar?: any;

  @Exclude()
  @ApiHideProperty()
  avatarUrl: string;

  @IsOptional()
  @StringToStringArrayTransform()
  interestTech: string[] = [];

  @IsOptional()
  @StringToStringArrayTransform()
  techStack: string[] = [];
}
