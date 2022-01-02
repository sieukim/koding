import { OmitType } from "@nestjs/swagger";
import { User } from "../../schemas/user.schema";

export class SignupResultDto extends OmitType(User, ["password"]) {
  constructor(user: User) {
    super();
    const { email, nickname, blogUrl, githubUrl, portfolioUrl } = user;
    this.email = email;
    this.nickname = nickname;
    this.blogUrl = blogUrl;
    this.githubUrl = githubUrl;
    this.portfolioUrl = portfolioUrl;
  }
}
