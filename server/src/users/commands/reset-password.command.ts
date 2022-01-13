import { ICommand } from "@nestjs/cqrs";

export class ResetPasswordCommand implements ICommand {
  constructor(
    public readonly email: string,
    public readonly newPassword: string,
    public readonly verifyToken: string,
  ) {}
}
