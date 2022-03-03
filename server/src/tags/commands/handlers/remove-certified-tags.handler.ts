import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RemoveCertifiedTagsCommand } from "../remove-certified-tags.command";
import { TagsRepository } from "../../tags.repository";

@CommandHandler(RemoveCertifiedTagsCommand)
export class RemoveCertifiedTagsHandler
  implements ICommandHandler<RemoveCertifiedTagsCommand>
{
  constructor(private readonly tagsRepository: TagsRepository) {}

  async execute(command: RemoveCertifiedTagsCommand) {
    const { tags, boardType, removeAllTags } = command;
    if (removeAllTags)
      await this.tagsRepository.removeAllCertifiedTags(boardType);
    else await this.tagsRepository.removeCertifiedTags(boardType, tags ?? []);
  }
}
