import { PickType } from "@nestjs/swagger";
import { User } from "../../entities/user.entity";
import { Expose, plainToClass } from "class-transformer";

export class UserInfoDto extends PickType(User, [
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
  "techStack",
  "interestTech",
  "avatarUrl",
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
