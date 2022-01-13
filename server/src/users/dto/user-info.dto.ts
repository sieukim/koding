import { PickType } from "@nestjs/swagger";
import { User } from "../../models/user.model";

const keys = [
  "email",
  "nickname",
  "emailSignupVerified",
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
    console.log(user);
    for (const key of keys) {
      if (user[key] !== undefined) this[key as keyof User] = user[key];
    }
  }
}
