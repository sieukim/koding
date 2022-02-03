import { Injectable } from "@nestjs/common";
import { ofType, Saga } from "@nestjs/cqrs";
import { map, Observable } from "rxjs";
import { UserDeletedEvent } from "../../users/events/user-deleted.event";
import { RenamePostWriterToNullCommand } from "../commands/rename-post-writer-to-null.command";
import { CommentAddedEvent } from "../../comments/events/comment-added.event";
import { CommentDeletedEvent } from "../../comments/events/comment-deleted.event";
import {
  IncreaseCommentCountCommand,
  IncreaseType,
} from "../commands/increase-comment-count.command";

@Injectable()
export class PostsSaga {
  @Saga()
  updatePostWriterToNull = ($events: Observable<any>) =>
    $events.pipe(
      ofType(UserDeletedEvent),
      map(({ nickname }) => new RenamePostWriterToNullCommand(nickname)),
    );

  @Saga()
  syncCommentCount = ($events: Observable<any>) =>
    $events.pipe(
      ofType(CommentAddedEvent, CommentDeletedEvent),
      map((event) => {
        if (event instanceof CommentAddedEvent)
          return new IncreaseCommentCountCommand(
            event.postIdentifier,
            IncreaseType.Positive,
          );
        else
          return new IncreaseCommentCountCommand(
            event.postIdentifier,
            IncreaseType.Negative,
          );
      }),
    );
}
