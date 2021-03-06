import { ICommand } from "@nestjs/cqrs";

export class ChangePasswordCommand implements ICommand {
  constructor(
    public readonly nickname: string,
    public readonly currentPassword: string,
    public readonly newPassword: string,
  ) {}
}
