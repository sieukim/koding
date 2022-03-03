import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { UnifiedSearchPostQuery } from "../unified-search-post.query";
import { PostSearchService } from "../../services/post-search.service";
import { UnifiedSearchPostsResultDto } from "../../dto/unified-search-posts-result.dto";
import { PostBoardTypes } from "../../../entities/post-board.type";

@QueryHandler(UnifiedSearchPostQuery)
export class UnifiedSearchPostHandler
  implements IQueryHandler<UnifiedSearchPostQuery>
{
  constructor(private readonly postSearchService: PostSearchService) {}

  async execute({
    postsPerBoard,
    query,
    tags,
    sortType,
  }: UnifiedSearchPostQuery) {
    const promises = await Promise.all(
      PostBoardTypes.map((boardType) =>
        this.postSearchService
          .searchPosts(boardType, { query, tags }, sortType, postsPerBoard)
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
