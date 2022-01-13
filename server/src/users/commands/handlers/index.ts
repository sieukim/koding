import { SignupLocalHandler } from "./signup-local.handler";
import { SignupGithubHandler } from "./signup-github.handler";
import { FollowUserHandler } from "./follow-user.handler";
import { UnfollowUserHandler } from "./unfollow-user.handler";
import { ComparePasswordHandler } from "./compare-password.handler";
import { VerifyEmailSignupHandler } from "./verify-email-signup.handler";
import { ResetPasswordHandler } from "./reset-password.handler";
import { ResetPasswordRequestHandler } from "./reset-password-request.handler";
import { VerifyGithubSignupHandler } from "./verify-github-signup.handler";

export const UserCommandHandlers = [
  SignupLocalHandler,
  SignupGithubHandler,
  FollowUserHandler,
  UnfollowUserHandler,
  ComparePasswordHandler,
  VerifyEmailSignupHandler,
  VerifyGithubSignupHandler,
  ResetPasswordHandler,
  ResetPasswordRequestHandler,
];
