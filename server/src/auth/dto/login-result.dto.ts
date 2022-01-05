import { PickType } from "@nestjs/swagger";
import { User } from "../../schemas/user.schema";

const keys: readonly (keyof User & string)[] = [
  "email",
  "nickname",
  "emailSignupVerified",
  "portfolioUrl",
  "githubUrl",
  "blogUrl",
  "githubUserInfo",
  "githubSignupVerified",
  "followersCount",
  "followingsCount"
];

export class LoginResultDto extends PickType(User, keys) {
  constructor(user: User) {
    super();
    for (const key in user) {
      if (keys.includes(key as keyof User))
        this[key] = user[key];
    }
  }
}
