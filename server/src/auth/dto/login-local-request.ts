import { PickType } from "@nestjs/swagger";
import { User } from "../../models/user.model";

export class LoginLocalRequest extends PickType(User, ["email", "password"]) {}
