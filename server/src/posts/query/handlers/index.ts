import { ReadPostHandler } from "./read-post.handler";
import { CheckUserLikePostHandler } from "./check-user-like-post.handler";
import { GetDailyRankingHandler } from "./get-daily-ranking.handler";
import { CheckUserScrapPostHandler } from "./check-user-scrap-post.handler";
import { GetPostsOfFollowingsHandler } from "./get-posts-of-followings.handler";

export const PostQueryHandlers = [
  ReadPostHandler,
  CheckUserLikePostHandler,
  GetDailyRankingHandler,
  CheckUserScrapPostHandler,
  GetPostsOfFollowingsHandler,
];
