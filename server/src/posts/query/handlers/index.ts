import { GetPostListHandler } from "./get-post-list.handler";
import { ReadPostHandler } from "./read-post.handler";
import { CheckUserLikePostHandler } from "./check-user-like-post.handler";

export const PostQueryHandlers = [
  GetPostListHandler,
  ReadPostHandler,
  CheckUserLikePostHandler,
];
