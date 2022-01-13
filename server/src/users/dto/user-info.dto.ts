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
  constructor(user: User) {
    super();
    for (const key in user) {
      if ((keys as readonly (keyof User)[]).includes(key as keyof User))
        this[key] = user[key];
    }
  }
}
