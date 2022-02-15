import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { SearchPostQuery } from "../search-post.query";
import { PostSearchService } from "../../services/post-search.service";
import { PostListWithCursorDto } from "../../../posts/dto/post-list-with-cursor.dto";

@QueryHandler(SearchPostQuery)
export class SearchPostHandler
  implements IQueryHandler<SearchPostQuery, PostListWithCursorDto>
{
  constructor(private readonly postSearchService: PostSearchService) {}

  async execute({
    boardType,
    query,
    tags,
    sortType,
    pageSize,
    cursor,
  }: SearchPostQuery): Promise<PostListWithCursorDto> {
    return this.postSearchService.searchPostsWithCursor(
      boardType,
      { query, tags },
      sortType,
      pageSize,
      cursor,
    );
  }
}
