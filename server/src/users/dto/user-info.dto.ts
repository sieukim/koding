import { PickType } from "@nestjs/swagger";
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

export class UserInfoDto extends PickType(User, keys) {
  followersCount: number;
  followingsCount: number;

  constructor(user: User) {
    super();
    for (const key of keys) {
      if (user[key] !== undefined) this[key as keyof User] = user[key];
    }
    // TODO: 유저 정보 조회 도메인 모델 따로 만들기
    if (!user.isBlogUrlPublic) delete this.blogUrl;
    if (!user.isGithubUrlPublic) delete this.githubUrl;
    if (!user.isPortfolioUrlPublic) delete this.portfolioUrl;
  }
}
