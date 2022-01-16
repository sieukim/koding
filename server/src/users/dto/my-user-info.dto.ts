import { ApiPropertyOptional, PickType } from "@nestjs/swagger";
import { User } from "../../models/user.model";

const keys = [
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
] as const;

export class MyUserInfoDto extends PickType(User, keys) {
  followersCount: number;
  followingsCount: number;

  @ApiPropertyOptional({
    description: "유저 깃허브 주소. 공개 여부와 관계 없이 항상 값을 가져옴",
  })
  githubUrl?: string;
  @ApiPropertyOptional({
    description: "유저 블로그 주소. 공개 여부와 관계 없이 항상 값을 가져옴",
  })
  blogUrl?: string;
  @ApiPropertyOptional({
    description: "유저 포트폴리오 주소. 공개 여부와 관계 없이 항상 값을 가져옴",
  })
  portfolioUrl?: string;

  constructor(me: User) {
    super();
    for (const key of keys) {
      if (me[key] !== undefined) this[key as keyof User] = me[key];
    }
  }
}
