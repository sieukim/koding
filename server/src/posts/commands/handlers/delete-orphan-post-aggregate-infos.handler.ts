import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteOrphanPostAggreateInfosCommand } from "../delete-orphan-post-aggreate-infos.command";
import { PostLikeService } from "../../services/post-like.service";
import { PostReportService } from "../../services/post-report.service";
import { PostRankingService } from "../../services/post-ranking.service";
import { PostScrapService } from "../../services/post-scrap.service";

@CommandHandler(DeleteOrphanPostAggreateInfosCommand)
export class DeleteOrphanPostAggregateInfosHandler
  implements ICommandHandler<DeleteOrphanPostAggreateInfosCommand>
{
  constructor(
    private readonly postLikeService: PostLikeService,
    private readonly postReportService: PostReportService,
    private readonly postScrapService: PostScrapService,
    private readonly postRankingService: PostRankingService,
  ) {}

  async execute(command: DeleteOrphanPostAggreateInfosCommand): Promise<any> {
    const { postIdentifier } = command;
    await Promise.all([
      this.postLikeService.removeOrphanPostLikes(postIdentifier),
      this.postReportService.removeOrphanPostReports(postIdentifier),
      this.postScrapService.removeOrphanPostScraps(postIdentifier),
      this.postRankingService.removeOrphanPostRanking(postIdentifier),
    ]);
  }
}
