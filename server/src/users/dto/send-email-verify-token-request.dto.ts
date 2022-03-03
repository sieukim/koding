import { PickType } from "@nestjs/swagger";
import { User } from "../../entities/user.entity";

export class SendEmailVerifyTokenRequestDto extends PickType(User, [
  "email",
] as const) {}
