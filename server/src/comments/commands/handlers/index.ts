import { AddCommentHandler } from "./add-comment.handler";
import { ModifyCommentHandler } from "./modify-comment.handler";
import { DeleteCommentHandler } from "./delete-comment.handler";

export const CommentCommandHandlers = [
  AddCommentHandler,
  ModifyCommentHandler,
  DeleteCommentHandler,
];
