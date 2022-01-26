import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { UnifiedSearchPostQuery } from "../unified-search-post.query";
import { PostSearchService } from "../../post.search.service";
import { PostBoardTypes } from "../../../models/post.model";
import { UnifiedSearchPostsResultDto } from "../../dto/unified-search-posts-result.dto";

@QueryHandler(UnifiedSearchPostQuery)
export class UnifiedSearchPostHandler
  implements IQueryHandler<UnifiedSearchPostQuery>
{
  constructor(private readonly postSearchService: PostSearchService) {}

  async execute({
    postsPerBoard,
    query,
  }: UnifiedSearchPostQuery): Promise<any> {
    const promises = await Promise.all(
      PostBoardTypes.map((boardType) =>
        this.postSearchService
          .searchPosts(query, boardType, postsPerBoard)
          .then((result) => ({ ...result, boardType })),
      ),
    );
    const json = {} as Parameters<
      typeof UnifiedSearchPostsResultDto.fromJson
    >[0];
    promises.forEach(
      ({ boardType, posts, totalCount }) =>
        (json[boardType] = { posts, totalCount }),
    );
    return UnifiedSearchPostsResultDto.fromJson(json);
  }
}
