import { AddCommentHandler } from "./add-comment.handler";
import { ModifyCommentHandler } from "./modify-comment.handler";
import { DeleteCommentHandler } from "./delete-comment.handler";
import { RenameCommentWriterToNullHandler } from "./rename-comment-writer-to-null.handler";
import { SyncPostTitleOfCommentHandler } from "./sync-post-title-of-comment.handler";
import { DeleteOrphanCommentsHandler } from "./delete-orphan-comments.handler";

export const CommentCommandHandlers = [
  AddCommentHandler,
  ModifyCommentHandler,
  DeleteCommentHandler,
  RenameCommentWriterToNullHandler,
  SyncPostTitleOfCommentHandler,
  DeleteOrphanCommentsHandler,
];
