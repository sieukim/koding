import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { SearchPostQuery } from "../search-post.query";
import { PostSearchService } from "../../post.search.service";
import { SearchPostResultWithCursorDto } from "../../dto/search-post-result-with-cursor.dto";

@QueryHandler(SearchPostQuery)
export class SearchPostHandler
  implements IQueryHandler<SearchPostQuery, SearchPostResultWithCursorDto>
{
  constructor(private readonly postSearchService: PostSearchService) {}

  async execute({
    boardType,
    query,
    pageSize,
    cursor,
  }: SearchPostQuery): Promise<SearchPostResultWithCursorDto> {
    return this.postSearchService.searchPostsWithCursor(
      boardType,
      query,
      pageSize,
      cursor,
    );
  }
}
