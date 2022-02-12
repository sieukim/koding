import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CancelPostReportCommand } from "../cancel-post-report.command";
import { PostReportService } from "../../../posts/services/post-report.service";

@CommandHandler(CancelPostReportCommand)
export class CancelPostReportHandler
  implements ICommandHandler<CancelPostReportCommand>
{
  constructor(private readonly postReportService: PostReportService) {}

  async execute(command: CancelPostReportCommand) {
    const { postIdentifier, nickname } = command;
    await this.postReportService.cancelReportPostByAdmin(
      postIdentifier,
      nickname,
    );
    return;
  }
}
