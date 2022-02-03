import { ForceDeleteCommentHandler } from "./force-delete-comment.handler";
import { ForceDeletePostHandler } from "./force-delete-post.handler";
import { SetAdminHandler } from "./set-admin.handler";
import { SuspendUserAccountHandler } from "./suspend-user-account.handler";
import { UnsuspendUserAccountHandler } from "./unsuspend-user-account.handler";

export const AdminCommandHandlers = [
  ForceDeleteCommentHandler,
  ForceDeletePostHandler,
  SuspendUserAccountHandler,
  SetAdminHandler,
  UnsuspendUserAccountHandler,
];
