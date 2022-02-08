import { ICommand } from "@nestjs/cqrs";

export class DeleteAvatarCommand implements ICommand {
  constructor(public readonly nickname: string) {}
}
