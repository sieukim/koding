import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteOrphanPostRankingCommand } from "../delete-orphan-post-ranking.command";
import { PostRankingService } from "../../services/post-ranking.service";

@CommandHandler(DeleteOrphanPostRankingCommand)
export class DeleteOrphanPostRankingHandler
  implements ICommandHandler<DeleteOrphanPostRankingCommand>
{
  constructor(private readonly postRankingService: PostRankingService) {}

  async execute(command: DeleteOrphanPostRankingCommand) {
    const { postIdentifier } = command;
    return this.postRankingService.removeOrphanPostRanking(postIdentifier);
  }
}
