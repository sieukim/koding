import { PickType } from "@nestjs/swagger";
import { User } from "../../entities/user.entity";

export class LoginLocalRequest extends PickType(User, ["email", "password"]) {}
