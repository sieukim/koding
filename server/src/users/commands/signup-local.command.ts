import { ICommand } from "@nestjs/cqrs";
import { SignupLocalRequestDto } from "../dto/signup-local-request.dto";

export class SignupLocalCommand implements ICommand {
  constructor(public readonly signupLocalRequest: SignupLocalRequestDto) {}
}
