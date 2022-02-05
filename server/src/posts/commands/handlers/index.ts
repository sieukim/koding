import { ModifyPostHandler } from "./modify-post.handler";
import { WritePostHandler } from "./write-post.handler";
import { DeletePostHandler } from "./delete-post.handler";
import { RenamePostWriterToNullHandler } from "./rename-post-writer-to-null.handler";
import { LikePostHandler } from "./like-post.handler";
import { UnlikePostHandler } from "./unlike-post.handler";
import { IncreaseCommentCountHandler } from "./increase-comment-count.handler";
import { DeleteOrphanPostLikesHandler } from "./delete-orphan-post-likes.handler";
import { IncreaseReadCountHandler } from "./increase-read-count.handler";

export const PostCommandHandlers = [
  ModifyPostHandler,
  WritePostHandler,
  DeletePostHandler,
  RenamePostWriterToNullHandler,
  LikePostHandler,
  UnlikePostHandler,
  IncreaseCommentCountHandler,
  DeleteOrphanPostLikesHandler,
  IncreaseReadCountHandler,
];
