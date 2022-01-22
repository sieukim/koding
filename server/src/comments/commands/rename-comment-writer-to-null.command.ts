import { ICommand } from "@nestjs/cqrs";

export class RenameCommentWriterToNullCommand implements ICommand {
  constructor(public readonly writerNickname: string) {}
}
