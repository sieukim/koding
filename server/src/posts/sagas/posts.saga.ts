import { Injectable } from "@nestjs/common";
import { ofType, Saga } from "@nestjs/cqrs";
import { filter, map, Observable } from "rxjs";
import { CommentAddedEvent } from "../../comments/events/comment-added.event";
import { CommentDeletedEvent } from "../../comments/events/comment-deleted.event";
import {
  IncreaseCommentCountCommand,
  IncreaseType,
} from "../commands/increase-comment-count.command";
import { PostReadCountIncreasedEvent } from "../events/post-read-count-increased.event";
import { IncreaseReadCountCommand } from "../commands/increase-read-count.command";

@Injectable()
export class PostsSaga {
  @Saga()
  increaseReadCount = ($events: Observable<any>) =>
    $events.pipe(
      ofType(PostReadCountIncreasedEvent),
      map(({ postIdentifier }) => new IncreaseReadCountCommand(postIdentifier)),
    );

  @Saga()
  syncCommentCount = ($events: Observable<any>) =>
    $events.pipe(
      filter(
        (event): event is CommentAddedEvent | CommentDeletedEvent =>
          event instanceof CommentAddedEvent ||
          event instanceof CommentDeletedEvent,
      ),
      map((event) => {
        if (event instanceof CommentDeletedEvent)
          return new IncreaseCommentCountCommand(
            event.postIdentifier,
            IncreaseType.Negative,
          );
        else
          return new IncreaseCommentCountCommand(
            event.postIdentifier,
            IncreaseType.Positive,
          );
      }),
    );
}
