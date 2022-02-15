import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CancelPostAllReportsCommand } from "../cancel-post-all-reports.command";
import { PostReportService } from "../../../posts/services/post-report.service";

@CommandHandler(CancelPostAllReportsCommand)
export class CancelPostAllReportsHandler
  implements ICommandHandler<CancelPostAllReportsCommand>
{
  constructor(private readonly postReportService: PostReportService) {}

  async execute(command: CancelPostAllReportsCommand) {
    const { postIdentifier } = command;
    await this.postReportService.cancelAllReportPostByAdmin(postIdentifier);
    return;
  }
}
