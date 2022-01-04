import { OmitType } from "@nestjs/swagger";
import { User } from "../../schemas/user.schema";

const excludeProperties = ["password", "emailSignupVerifyToken", "githubSignupVerifyToken", "passwordResetToken", "followings", "followers"] as const;

export class LoginResultDto extends OmitType(User, excludeProperties) {
  constructor(user: User) {
    super();
    const keys: Array<keyof LoginResultDto> = [
      "email",
      "nickname",
      "emailSignupVerified",
      "portfolioUrl",
      "githubUrl",
      "blogUrl",
      "githubUserInfo",
      "githubUserIdentifier",
      "githubSignupVerified",
      "followersCount",
      "followingsCount"
    ];
    keys.forEach((key) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return (this[key] = user[key]);
    });
  }
}
