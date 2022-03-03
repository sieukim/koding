import { ReadPostHandler } from "./read-post.handler";
import { CheckUserLikePostHandler } from "./check-user-like-post.handler";
import { GetDailyRankingHandler } from "./get-daily-ranking.handler";
import { CheckUserScrapPostQuery } from "../check-user-scrap-post.query";
import { GetPostsOfFollowingsQuery } from "../get-posts-of-followings.query";

export const PostQueryHandlers = [
  ReadPostHandler,
  CheckUserLikePostHandler,
  GetDailyRankingHandler,
  CheckUserScrapPostQuery,
  GetPostsOfFollowingsQuery,
];
