import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { SearchPostQuery } from "../search-post.query";
import { PostSearchService } from "../../post.search.service";
import { PostListDto } from "../../../posts/dto/post-list.dto";

@QueryHandler(SearchPostQuery)
export class SearchPostHandler implements IQueryHandler<SearchPostQuery> {
  constructor(private readonly postSearchService: PostSearchService) {}

  async execute({
    boardType,
    query,
    pageSize,
    cursor,
  }: SearchPostQuery): Promise<PostListDto> {
    return this.postSearchService.searchPostsWithCursor(
      boardType,
      query,
      pageSize,
      cursor,
    );
  }
}
