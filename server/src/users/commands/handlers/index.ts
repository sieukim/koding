import { SignupLocalHandler } from "./signup-local.handler";
import { SignupGithubHandler } from "./signup-github.handler";
import { FollowUserHandler } from "./follow-user.handler";
import { UnfollowUserHandler } from "./unfollow-user.handler";
import { ComparePasswordHandler } from "./compare-password.handler";
import { ResetPasswordHandler } from "./reset-password.handler";
import { ResetPasswordRequestHandler } from "./reset-password-request.handler";
import { VerifyGithubSignupHandler } from "./verify-github-signup.handler";
import { ChangeProfileHandler } from "./change-profile.handler";
import { ChangePasswordHandler } from "./change-password.handler";
import { DeleteAccountHandler } from "./delete-account.handler";
import { DeleteAvatarHandler } from "./delete-avatar.handler";
import { SendEmailVerifyTokenHandler } from "./send-email-verify-token.handler";

export const UserCommandHandlers = [
  SignupLocalHandler,
  SignupGithubHandler,
  FollowUserHandler,
  UnfollowUserHandler,
  ComparePasswordHandler,
  VerifyGithubSignupHandler,
  ResetPasswordHandler,
  ResetPasswordRequestHandler,
  ChangeProfileHandler,
  ChangePasswordHandler,
  DeleteAccountHandler,
  DeleteAvatarHandler,
  SendEmailVerifyTokenHandler,
];
