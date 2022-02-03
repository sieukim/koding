import { Injectable } from "@nestjs/common";
import { ofType, Saga } from "@nestjs/cqrs";
import { map, Observable } from "rxjs";
import { UserDeletedEvent } from "../../users/events/user-deleted.event";
import { RenameCommentWriterToNullCommand } from "../commands/rename-comment-writer-to-null.command";
import { PostDeletedEvent } from "../../posts/events/post-deleted.event";
import { DeleteOrphanCommentsCommand } from "../commands/delete-orphan-comments.command";
import { PostModifiedEvent } from "../../posts/events/post-modified.event";
import { SyncPostTitleOfCommentCommand } from "../commands/sync-post-title-of-comment.command";

@Injectable()
export class CommentsSaga {
  @Saga()
  renameWriterToNull = ($events: Observable<any>) =>
    $events.pipe(
      ofType(UserDeletedEvent),
      map(({ nickname }) => new RenameCommentWriterToNullCommand(nickname)),
    );

  @Saga()
  removeCommentsForDeletedPost = ($events: Observable<any>) =>
    $events.pipe(
      ofType(PostDeletedEvent),
      map(
        ({ postIdentifier }) => new DeleteOrphanCommentsCommand(postIdentifier),
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
