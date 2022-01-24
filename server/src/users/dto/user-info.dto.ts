import { PickType } from "@nestjs/swagger";
import { User } from "../../models/user.model";
import { Expose, plainToClass } from "class-transformer";

export class UserInfoDto extends PickType(User, [
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
] as const) {
  @Expose()
  followersCount: number;

  @Expose()
  followingsCount: number;

  static fromModel(model: User) {
    return plainToClass(UserInfoDto, model, {
      excludeExtraneousValues: true,
      groups: ["user"],
    });
  }
}
