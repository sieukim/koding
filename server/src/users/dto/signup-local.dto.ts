import { PickType } from "@nestjs/swagger";
import { User } from "../../schemas/user.schema";

export class SignupLocalDto extends PickType(User, [
  "email",
  "password",
  "nickname",
  "blogUrl",
  "githubUrl",
  "portfolioUrl"
]) {
}
