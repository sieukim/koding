import { ModifyPostHandler } from "./modify-post.handler";
import { WritePostHandler } from "./write-post.handler";
import { DeletePostHandler } from "./delete-post.handler";
import { LikePostHandler } from "./like-post.handler";
import { UnlikePostHandler } from "./unlike-post.handler";
import { IncreaseCommentCountHandler } from "./increase-comment-count.handler";
import { IncreaseReadCountHandler } from "./increase-read-count.handler";
import { ReportPostHandler } from "./report-post.handler";
import { ScrapPostHandler } from "./scrap-post.handler";
import { UnscrapPostHandler } from "./unscrap-post.handler";

export const PostCommandHandlers = [
  ModifyPostHandler,
  WritePostHandler,
  DeletePostHandler,
  LikePostHandler,
  UnlikePostHandler,
  IncreaseCommentCountHandler,
  IncreaseReadCountHandler,
  ReportPostHandler,
  ScrapPostHandler,
  UnscrapPostHandler,
];
