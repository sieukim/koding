import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CancelPostReportCommand } from "../cancel-post-report.command";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { PostReport } from "../../../entities/post-report.entity";
import { increaseField } from "../../../common/utils/increase-field";
import { Post } from "../../../entities/post.entity";

@CommandHandler(CancelPostReportCommand)
export class CancelPostReportHandler
  implements ICommandHandler<CancelPostReportCommand>
{
  @Transaction()
  async execute(
    command: CancelPostReportCommand,
    @TransactionManager() tm?: EntityManager,
  ) {
    const em = tm!;
    const {
      postIdentifier: { postId, boardType },
      nickname,
    } = command;
    const postReport = await em.find(PostReport, {
      where: { postId, nickname },
    });
    if (postReport) {
      await Promise.all([
        em.remove(postReport),
        increaseField(em, Post, "reportCount", -1, {
          postId,
          boardType,
        }),
      ]);
    }
    return;
  }
}
