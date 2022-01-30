import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteOrphanCommentsCommand } from "../delete-orphan-comments.command";
import { CommentsRepository } from "../../comments.repository";

@CommandHandler(DeleteOrphanCommentsCommand)
export class DeleteOrphanCommentsHandler
  implements ICommandHandler<DeleteOrphanCommentsCommand>
{
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async execute(command: DeleteOrphanCommentsCommand): Promise<number> {
    const { postIdentifier } = command;
    return this.commentsRepository.removeComments(postIdentifier);
  }
}
