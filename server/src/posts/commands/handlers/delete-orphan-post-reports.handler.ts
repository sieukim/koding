import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteOrphanPostReportsCommand } from "../delete-orphan-post-reports.command";
import { PostReportService } from "../../services/post-report.service";

@CommandHandler(DeleteOrphanPostReportsCommand)
export class DeleteOrphanPostReportsHandler
  implements ICommandHandler<DeleteOrphanPostReportsCommand>
{
  constructor(private readonly postReportService: PostReportService) {}

  async execute(command: DeleteOrphanPostReportsCommand) {
    const { postIdentifier } = command;
    return this.postReportService.removeOrphanPostReports(postIdentifier);
  }
}
