import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetReportedPostsQuery } from "../get-reported-posts.query";
import { GetReportedPostsResultDto } from "../../dto/get-reported-posts-result.dto";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { Post } from "../../../entities/post.entity";
import { Fetched } from "../../../common/types/fetched.type";

@QueryHandler(GetReportedPostsQuery)
export class GetReportedPostsHandler
  implements IQueryHandler<GetReportedPostsQuery>
{
  @Transaction()
  async execute(
    query: GetReportedPostsQuery,
    @TransactionManager() tm?: EntityManager,
  ) {
    const em = tm!;
    const { pageSize, cursor } = query;
    let nextPageCursor: string | undefined;
    const qb = await em
      .createQueryBuilder(Post, "post")
      .leftJoinAndSelect("post.reports", "report")
      .where("post.reportCount >= 10")
      .orderBy("post.reportCount", "DESC")
      .addOrderBy("post.postId", "DESC")
      .limit(pageSize);
    if (cursor) {
      const [reportCount, postId] = cursor.split(",");
      qb.andWhere(
        "(post.reportCount < :reportCount OR (post.reportCount = :reportCount AND post.postId < :postId))",
        {
          reportCount: parseInt(reportCount),
          postId,
        },
      );
    }
    const postsWithReports = (await qb.getMany()) as Array<
      Fetched<Post, "reports">
    >;
    if (postsWithReports.length === pageSize) {
      const { reportCount, postId } = postsWithReports[pageSize - 1];
      nextPageCursor = [reportCount.toString(), postId].join(",");
    }
    return GetReportedPostsResultDto.fromModelArray(
      postsWithReports,
      nextPageCursor,
    );
  }
}
