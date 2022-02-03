import { GetPostListHandler } from "./get-post-list.handler";
import { ReadPostHandler } from "./read-post.handler";
import { IsUserLikePostHandler } from "./is-user-like-post.handler";

export const PostQueryHandlers = [
  GetPostListHandler,
  ReadPostHandler,
  IsUserLikePostHandler,
];
