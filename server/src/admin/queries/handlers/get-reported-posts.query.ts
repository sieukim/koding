import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetReportedPostsQuery } from "../get-reported-posts.query";
import { PostReportService } from "../../../posts/services/post-report.service";
import { GetReportedPostsResultDto } from "../../dto/get-reported-posts-result.dto";

@QueryHandler(GetReportedPostsQuery)
export class GetReportedPostsHandler
  implements IQueryHandler<GetReportedPostsQuery>
{
  constructor(private readonly postReportService: PostReportService) {}

  async execute(query: GetReportedPostsQuery) {
    const { pageSize, cursor } = query;
    let nextPageCursor: string | undefined;
    const postsWithReports = await this.postReportService.getReportedPosts(
      pageSize + 1,
      cursor,
    );
    if (postsWithReports.length === pageSize + 1) {
      nextPageCursor = postsWithReports.pop().postId;
    }
    return GetReportedPostsResultDto.fromJsonArray(
      postsWithReports,
      nextPageCursor,
    );
  }
}
