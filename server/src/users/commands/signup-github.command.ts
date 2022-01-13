import { ICommand } from "@nestjs/cqrs";
import { SignupGithubRequestDto } from "../../auth/dto/signup-github-request.dto";

export class SignupGithubCommand implements ICommand {
  constructor(public readonly signupGithubRequest: SignupGithubRequestDto) {}
}
