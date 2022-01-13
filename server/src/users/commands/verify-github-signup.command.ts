import { ICommand } from "@nestjs/cqrs";

export class VerifyGithubSignupCommand implements ICommand {
  constructor(
    public readonly email: string,
    public readonly newNickname: string,
    public readonly verifyToken: string,
  ) {}
}
