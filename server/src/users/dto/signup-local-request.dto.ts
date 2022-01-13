import { PickType } from "@nestjs/swagger";
import { User } from "../../models/user.model";

export class SignupLocalRequestDto extends PickType(User, [
  "email",
  "password",
  "nickname",
  "blogUrl",
  "githubUrl",
  "portfolioUrl",
]) {}
