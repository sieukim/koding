import { GetPostListHandler } from "./get-post-list.handler";
import { ReadPostHandler } from "./read-post.handler";
import { CheckUserLikePostHandler } from "./check-user-like-post.handler";
import { GetDailyRankingHandler } from "./get-daily-ranking.handler";
import { CheckUserScrapPostQuery } from "../check-user-scrap-post.query";

export const PostQueryHandlers = [
  GetPostListHandler,
  ReadPostHandler,
  CheckUserLikePostHandler,
  GetDailyRankingHandler,
  CheckUserScrapPostQuery,
];
