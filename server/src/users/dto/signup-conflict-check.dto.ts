import { PartialType, PickType } from "@nestjs/swagger";
import { User } from "../../schemas/user.schema";

export class SignupConflictCheckDto extends PartialType(
  PickType(User, ["email", "nickname"] as const)
) {
}
