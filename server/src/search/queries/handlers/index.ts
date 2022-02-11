import { UnifiedSearchPostHandler } from "./unified-search-post.handler";
import { SearchPostHandler } from "./search-post.handler";
import { SearchNicknameHandler } from "./search-nickname.handler";

export const SearchQueryHandlers = [
  UnifiedSearchPostHandler,
  SearchPostHandler,
  SearchNicknameHandler,
];
