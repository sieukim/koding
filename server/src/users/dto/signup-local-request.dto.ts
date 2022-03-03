import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
  PickType,
} from "@nestjs/swagger";
import { User } from "../../entities/user.entity";
import { Exclude } from "class-transformer";
import { IsOptional, IsString, IsUrl } from "class-validator";
import { StringToStringArrayTransform } from "../../common/decorator/string-to-string-array-transform.decorator";

export class SignupLocalRequestDto extends PickType(User, [
  "email",
  "password",
  "nickname",
  "interestTech",
  "techStack",
]) {
  @ApiProperty({
    type: String,
    format: "binary",
  })
  avatar?: any;

  password!: string;

  @IsString()
  @ApiProperty({
    description: "이메일로 받은 인증 토큰",
  })
  verifyToken: string;

  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional({
    example: "https://blog.naver.com/test",
    description: "사용자 블로그 주소.",
    type: String,
  })
  blogUrl?: string;

  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional({
    example: "https://test.github.com",
    description: "사용자 깃허브 주소.",
    type: String,
  })
  githubUrl?: string;

  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional({
    example: "https://linktr.ee/test",
    description: "사용자 포트폴리오 주소.",
    type: String,
  })
  portfolioUrl?: string;

  @Exclude()
  @ApiHideProperty()
  avatarUrl?: string;

  @IsOptional()
  @StringToStringArrayTransform({ defaultValue: [] })
  @ApiPropertyOptional({
    description:
      "보유 기술. 여러개인 경우 , 로 구분하고, 없는 경우는 값을 넣지 않음",
  })
  interestTech: string[] = [];

  @IsOptional()
  @StringToStringArrayTransform({ defaultValue: [] })
  @ApiPropertyOptional({
    description:
      "관심 분야. 여러개인 경우 , 로 구분하고, 없는 경우는 값을 넣지 않음",
  })
  techStack: string[] = [];
}
