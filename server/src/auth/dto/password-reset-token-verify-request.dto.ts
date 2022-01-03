import { PickType } from "@nestjs/swagger";
import { PasswordResetRequestDto } from "./password-reset.request.dto";

export class PasswordResetTokenVerifyRequestDto extends PickType(PasswordResetRequestDto, ["email", "verifyToken"]) {
}