import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CancelPostAllReportsCommand } from "../cancel-post-all-reports.command";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { PostReport } from "../../../entities/post-report.entity";
import { increaseField } from "../../../common/utils/increase-field";
import { Post } from "../../../entities/post.entity";

@CommandHandler(CancelPostAllReportsCommand)
export class CancelPostAllReportsHandler
  implements ICommandHandler<CancelPostAllReportsCommand>
{
  @Transaction()
  async execute(
    command: CancelPostAllReportsCommand,
    @TransactionManager() tm?: EntityManager,
  ) {
    const em = tm!;
    const {
      postIdentifier: { postId, boardType },
    } = command;
    const result = await em
      .createQueryBuilder()
      .delete()
      .from(PostReport)
      .where("postId = :postId AND boardType = :boardType", {
        postId,
        boardType,
      })
      .execute();
    if (result.affected && result.affected > 0) {
      await increaseField(em, Post, "reportCount", -1 * result.affected, {
        postId,
        boardType,
      });
    }
  }
}
