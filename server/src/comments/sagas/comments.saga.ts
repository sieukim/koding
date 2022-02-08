import { Injectable } from "@nestjs/common";
import { ofType, Saga } from "@nestjs/cqrs";
import { map, mergeMap, Observable } from "rxjs";
import { UserDeletedEvent } from "../../users/events/user-deleted.event";
import { RenameCommentWriterToNullCommand } from "../commands/rename-comment-writer-to-null.command";
import { PostDeletedEvent } from "../../posts/events/post-deleted.event";
import { DeleteOrphanCommentsCommand } from "../commands/delete-orphan-comments.command";
import { PostModifiedEvent } from "../../posts/events/post-modified.event";
import { SyncPostTitleOfCommentCommand } from "../commands/sync-post-title-of-comment.command";
import { DeleteCommentLikeOfDeletedPostCommand } from "../commands/delete-comment-like-of-deleted-post.command";
import { CommentDeletedEvent } from "../events/comment-deleted.event";
import { DeleteOrphanCommentLikesCommand } from "../commands/delete-orphan-comment-likes.command";

@Injectable()
export class CommentsSaga {
  @Saga()
  renameWriterToNull = ($events: Observable<any>) =>
    $events.pipe(
      ofType(UserDeletedEvent),
      map(({ nickname }) => new RenameCommentWriterToNullCommand(nickname)),
    );

  @Saga()
  deleteOrphanComments = ($events: Observable<any>) =>
    $events.pipe(
      ofType(PostDeletedEvent),
      mergeMap(({ postIdentifier }) => [
        new DeleteOrphanCommentsCommand(postIdentifier),
        new DeleteCommentLikeOfDeletedPostCommand(postIdentifier),
      ]),
    );

  @Saga()
  deleteOrphanCommentLikes = ($events: Observable<any>) =>
    $events.pipe(
      ofType(CommentDeletedEvent),
      map(
        ({ commentId, postIdentifier }) =>
          new DeleteOrphanCommentLikesCommand(postIdentifier, commentId),
      ),
    );

  @Saga()
  syncPostTitle = ($events: Observable<any>) =>
    $events.pipe(
      ofType(PostModifiedEvent),
      map(
        ({ postIdentifier }) =>
          new SyncPostTitleOfCommentCommand(postIdentifier),
      ),
    );
}
