import { GetFollowerUsersHandler } from "./get-follower-users.handler";
import { GetFollowingUsersHandler } from "./get-following-users.handler";
import { CheckExistenceHandler } from "./check-existence.handler";
import { CheckPasswordTokenValidityHandler } from "./check-password-token-validity.handler";

export const UserQueryHandlers = [
  GetFollowerUsersHandler,
  GetFollowingUsersHandler,
  CheckExistenceHandler,
  CheckPasswordTokenValidityHandler,
];