import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteOrphanPostScrapsCommand } from "../delete-orphan-post-scraps.command";
import { PostScrapService } from "../../services/post-scrap.service";

@CommandHandler(DeleteOrphanPostScrapsCommand)
export class DeleteOrphanPostScrapsHandler
  implements ICommandHandler<DeleteOrphanPostScrapsCommand>
{
  constructor(private readonly postScrapService: PostScrapService) {}

  async execute(command: DeleteOrphanPostScrapsCommand): Promise<any> {
    const { postIdentifier } = command;
    return this.postScrapService.removeOrphanPostScraps(postIdentifier);
  }
}
