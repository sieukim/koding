import { AddCommentHandler } from "./add-comment.handler";
import { ModifyCommentHandler } from "./modify-comment.handler";
import { DeleteCommentHandler } from "./delete-comment.handler";
import { LikeCommentHandler } from "./like-comment.handler";
import { UnlikeCommentHandler } from "./unlike-comment.handler";

export const CommentCommandHandlers = [
  AddCommentHandler,
  ModifyCommentHandler,
  DeleteCommentHandler,
  LikeCommentHandler,
  UnlikeCommentHandler,
];
