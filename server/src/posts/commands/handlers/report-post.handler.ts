import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ReportPostCommand } from "../report-post.command";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { PostReport } from "../../../entities/post-report.entity";
import { ConflictException } from "@nestjs/common";
import { increaseField } from "../../../common/utils/increase-field";
import { Post } from "../../../entities/post.entity";

@CommandHandler(ReportPostCommand)
export class ReportPostHandler implements ICommandHandler<ReportPostCommand> {
  @Transaction()
  async execute(
    command: ReportPostCommand,
    @TransactionManager() tm?: EntityManager,
  ) {
    const em = tm!;
    const {
      postIdentifier: { postId, boardType },
      nickname,
      reportReason,
    } = command;
    let postReport = await em.findOne(PostReport, {
      where: { postId, nickname },
    });
    if (!postReport) {
      postReport = new PostReport({
        postId,
        boardType,
        nickname,
        reportReason,
      });

      await Promise.all([
        em.save(postReport, { reload: false }),
        increaseField(em, Post, "reportCount", 1, { postId }),
      ]);
    } else {
      throw new ConflictException("이미 신고한 게시글");
    }
    return;
  }
}
