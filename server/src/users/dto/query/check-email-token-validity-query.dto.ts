import { PickType } from "@nestjs/swagger";
import { EmailVerifyToken } from "../../../entities/email-verify-token.entity";

export class CheckEmailTokenValidityQueryDto extends PickType(
  EmailVerifyToken,
  ["email", "verifyToken"] as const,
) {}
