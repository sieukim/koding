import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ReportPostCommand } from "../report-post.command";
import { PostReportService } from "../../services/post-report.service";

@CommandHandler(ReportPostCommand)
export class ReportPostHandler implements ICommandHandler<ReportPostCommand> {
  constructor(private readonly postReportService: PostReportService) {}

  async execute(command: ReportPostCommand) {
    const { postIdentifier, nickname, reportReason } = command;
    await this.postReportService.reportPost(
      postIdentifier,
      nickname,
      reportReason,
    );
    return;
  }
}
