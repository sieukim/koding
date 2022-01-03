import { OmitType } from "@nestjs/swagger";
import { User } from "../../schemas/user.schema";

const excludeProperties = ["password", "emailSignupVerifyToken", "githubSignupVerifyToken", "passwordResetToken"] as const;

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
      "githubSignupVerified"
    ];
    keys.forEach((key) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return (this[key] = user[key]);
    });
  }
}
