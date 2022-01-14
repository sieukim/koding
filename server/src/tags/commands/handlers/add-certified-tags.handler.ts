import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AddCertifiedTagsCommand } from "../add-certified-tags.command";
import { TagsRepository } from "../../tags.repository";

@CommandHandler(AddCertifiedTagsCommand)
export class AddCertifiedTagsHandler
  implements ICommandHandler<AddCertifiedTagsCommand, string[]>
{
  constructor(private readonly tagsRepository: TagsRepository) {}

  async execute(command: AddCertifiedTagsCommand): Promise<string[]> {
    const { tags, boardType } = command;
    await this.tagsRepository.addCertifiedTags(boardType, tags);
    return tags;
  }
}
