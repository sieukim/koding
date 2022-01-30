import { Injectable } from "@nestjs/common";
import { ofType, Saga } from "@nestjs/cqrs";
import { map, Observable } from "rxjs";
import { UserDeletedEvent } from "../../users/events/user-deleted.event";
import { RenameCommentWriterToNullCommand } from "../commands/rename-comment-writer-to-null.command";
import { PostDeletedEvent } from "../../posts/events/post-deleted.event";
import { DeleteOrphanCommentsCommand } from "../commands/delete-orphan-comments.command";

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
}
