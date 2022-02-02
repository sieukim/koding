import { GetFollowerUsersHandler } from "./get-follower-users.handler";
import { GetFollowingUsersHandler } from "./get-following-users.handler";
import { CheckExistenceHandler } from "./check-existence.handler";
import { CheckPasswordTokenValidityHandler } from "./check-password-token-validity.handler";
import { GetUserInfoHandler } from "./get-user-info.handler";
import { CheckFollowingHandler } from "./check-following.handler";
import { GetMyUserInfoHandler } from "./get-my-user-info.handler";
import { GetWritingPostsHandler } from "./get-writing-posts.handler";
import { GetWritingCommentsHandler } from "./get-writing-comments.handler";

export const UserQueryHandlers = [
  GetFollowerUsersHandler,
  GetFollowingUsersHandler,
  CheckExistenceHandler,
  CheckPasswordTokenValidityHandler,
  GetUserInfoHandler,
  CheckFollowingHandler,
  GetMyUserInfoHandler,
  GetWritingPostsHandler,
  GetWritingCommentsHandler,
];
