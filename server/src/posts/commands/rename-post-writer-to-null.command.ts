import { ICommand } from "@nestjs/cqrs";

export class RenamePostWriterToNullCommand implements ICommand {
  constructor(public readonly writerNickname: string) {}
}
