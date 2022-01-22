import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RenamePostWriterToNullCommand } from "../rename-post-writer-to-null.command";
import { PostsRepository } from "../../posts.repository";

@CommandHandler(RenamePostWriterToNullCommand)
export class RenamePostWriterToNullHandler
  implements ICommandHandler<RenamePostWriterToNullCommand>
{
  constructor(private readonly postsRepository: PostsRepository) {}

  execute(command: RenamePostWriterToNullCommand): Promise<any> {
    const { writerNickname } = command;
    return this.postsRepository.renameWriter(writerNickname, null);
  }
}
