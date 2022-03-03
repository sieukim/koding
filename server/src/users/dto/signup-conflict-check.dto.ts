import { PartialType, PickType } from "@nestjs/swagger";
import { User } from "../../entities/user.entity";

export class SignupConflictCheckDto extends PartialType(
  PickType(User, ["email", "nickname"] as const),
) {}
