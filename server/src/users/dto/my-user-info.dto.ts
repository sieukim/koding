import { ApiPropertyOptional, PickType } from "@nestjs/swagger";
import { User } from "../../entities/user.entity";
import { Expose, plainToClass } from "class-transformer";

export class MyUserInfoDto extends PickType(User, [
  "email",
  "nickname",
  "isGithubUser",
  "isEmailUser",
  "isPortfolioUrlPublic",
  "isGithubUrlPublic",
  "isBlogUrlPublic",
  "portfolioUrl",
  "githubUrl",
  "blogUrl",
  "githubUserInfo",
  "followersCount",
  "followingsCount",
  "isGithubUser",
  "isEmailUser",
  "avatarUrl",
  "techStack",
  "interestTech",
  "roles",
] as const) {
  @Expose()
  followersCount: number;
  @Expose()
  followingsCount: number;

  @ApiPropertyOptional({
    description: "사용자 깃허브 주소. 공개 여부와 관계 없이 항상 값을 가져옴",
  })
  githubUrl: string | null;

  @ApiPropertyOptional({
    description: "사용자 블로그 주소. 공개 여부와 관계 없이 항상 값을 가져옴",
  })
  blogUrl: string | null;
  @ApiPropertyOptional({
    description:
      "사용자 포트폴리오 주소. 공개 여부와 관계 없이 항상 값을 가져옴",
  })
  portfolioUrl: string | null;

  static fromModel(model: User) {
    return plainToClass(MyUserInfoDto, model, {
      excludeExtraneousValues: true,
    });
  }
}
