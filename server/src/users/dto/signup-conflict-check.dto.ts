import { PartialType, PickType } from "@nestjs/swagger";
import { User } from "../../models/user.model";

export class SignupConflictCheckDto extends PartialType(
  PickType(User, ["email", "nickname"] as const),
) {}
