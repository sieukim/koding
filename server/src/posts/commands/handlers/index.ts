import { ModifyPostHandler } from "./modify-post.handler";
import { WritePostHandler } from "./write-post.handler";
import { DeletePostHandler } from "./delete-post.handler";
import { RenamePostWriterToNullHandler } from "./rename-post-writer-to-null.handler";
import { LikePostHandler } from "./like-post.handler";
import { UnlikePostHandler } from "./unlike-post.handler";
import { IncreaseCommentCountHandler } from "./increase-comment-count.handler";
import { DeleteOrphanPostLikesHandler } from "./delete-orphan-post-likes.handler";
import { IncreaseReadCountHandler } from "./increase-read-count.handler";
import { DeleteOrphanPostRankingsHandler } from "./delete-orphan-post-rankings.handler";
import { DeleteOrphanPostScrapsHandler } from "./delete-orphan-post-scraps.handler";
import { DeleteOrphanPostReportsHandler } from "./delete-orphan-post-reports.handler";
import { ReportPostHandler } from "./report-post.handler";

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
  DeleteOrphanPostRankingsHandler,
  DeleteOrphanPostScrapsHandler,
  DeleteOrphanPostReportsHandler,
  ReportPostHandler,
];
