import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteOrphanPostRankingsCommand } from "../delete-orphan-post-rankings.command";
import { PostRankingService } from "../../services/post-ranking.service";

@CommandHandler(DeleteOrphanPostRankingsCommand)
export class DeleteOrphanPostRankingsHandler
  implements ICommandHandler<DeleteOrphanPostRankingsCommand>
{
  constructor(private readonly postRankingService: PostRankingService) {}

  async execute(command: DeleteOrphanPostRankingsCommand) {
    const { postIdentifier } = command;
    return this.postRankingService.removeOrphanPostRanking(postIdentifier);
  }
}
