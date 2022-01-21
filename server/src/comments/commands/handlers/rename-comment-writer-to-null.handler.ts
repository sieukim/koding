import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RenameCommentWriterToNullCommand } from "../rename-comment-writer-to-null.command";
import { CommentsRepository } from "../../comments.repository";

@CommandHandler(RenameCommentWriterToNullCommand)
export class RenameCommentWriterToNullHandler
  implements ICommandHandler<RenameCommentWriterToNullCommand>
{
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async execute(command: RenameCommentWriterToNullCommand): Promise<any> {
    const { writerNickname } = command;
    await this.commentsRepository.renameWriter(writerNickname, null);
  }
}
