import { PickType } from "@nestjs/swagger";
import { User } from "../../schemas/user.schema";

export class LoginLocalRequest extends PickType(User, ["email", "password"]) {
}
