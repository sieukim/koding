import { PickType } from "@nestjs/swagger";
import { User } from "../../entities/user.entity";
import { plainToClass } from "class-transformer";

export class AccountSuspendResultDto extends PickType(User, [
  "nickname",
  "accountSuspendedUntil",
] as const) {
  static fromModel(user: User) {
    return plainToClass(AccountSuspendResultDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
