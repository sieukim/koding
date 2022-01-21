import { AddCommentHandler } from "./add-comment.handler";
import { ModifyCommentHandler } from "./modify-comment.handler";
import { DeleteCommentHandler } from "./delete-comment.handler";
import { RenameCommentWriterToNullHandler } from "./rename-comment-writer-to-null.handler";

export const CommentCommandHandlers = [
  AddCommentHandler,
  ModifyCommentHandler,
  DeleteCommentHandler,
  RenameCommentWriterToNullHandler,
];
