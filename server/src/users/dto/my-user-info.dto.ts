import { ApiPropertyOptional, PickType } from "@nestjs/swagger";
import { User } from "../../models/user.model";
import { Expose, plainToClass } from "class-transformer";

export class MyUserInfoDto extends PickType(User, [
  "email",
  "nickname",
  "emailSignupVerified",
  "isPortfolioUrlPublic",
  "isGithubUrlPublic",
  "isBlogUrlPublic",
  "portfolioUrl",
  "githubUrl",
  "blogUrl",
  "githubUserInfo",
  "githubSignupVerified",
  "followersCount",
  "followingsCount",
  "isGithubUser",
  "isEmailUser",
  "avatarUrl",
] as const) {
  @Expose()
  followersCount: number;
  @Expose()
  followingsCount: number;

  @ApiPropertyOptional({
    description: "사용자 깃허브 주소. 공개 여부와 관계 없이 항상 값을 가져옴",
  })
  githubUrl?: string;
  @ApiPropertyOptional({
    description: "사용자 블로그 주소. 공개 여부와 관계 없이 항상 값을 가져옴",
  })
  blogUrl?: string;
  @ApiPropertyOptional({
    description:
      "사용자 포트폴리오 주소. 공개 여부와 관계 없이 항상 값을 가져옴",
  })
  portfolioUrl?: string;

  static fromModel(model: User) {
    return plainToClass(MyUserInfoDto, model, {
      excludeExtraneousValues: true,
    });
  }
}
