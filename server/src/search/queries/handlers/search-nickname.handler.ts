import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { SearchNicknameQuery } from "../search-nickname.query";
import { UserSearchService } from "../../services/user-search.service";

@QueryHandler(SearchNicknameQuery)
export class SearchNicknameHandler
  implements IQueryHandler<SearchNicknameQuery>
{
  constructor(private readonly userSearchService: UserSearchService) {}

  async execute(query: SearchNicknameQuery) {
    const { nickname, cursor, pageSize } = query;
    return this.userSearchService.searchNicknameWithCursor(
      nickname,
      pageSize,
      cursor,
    );
  }
}
