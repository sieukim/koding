import { ForceDeleteCommentHandler } from "./force-delete-comment.handler";
import { ForceDeletePostHandler } from "./force-delete-post.handler";
import { SetAdminHandler } from "./set-admin.handler";
import { SuspendUserAccountHandler } from "./suspend-user-account.handler";
import { ForceDeleteUserAccountHandler } from "./force-delete-user-account.handler";

export const AdminCommandHandlers = [
  ForceDeleteCommentHandler,
  ForceDeletePostHandler,
  ForceDeleteUserAccountHandler,
  SuspendUserAccountHandler,
  SetAdminHandler,
];
