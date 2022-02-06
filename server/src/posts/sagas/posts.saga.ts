import { Injectable } from "@nestjs/common";
import { ofType, Saga } from "@nestjs/cqrs";
import { filter, map, mergeMap, Observable } from "rxjs";
import { UserDeletedEvent } from "../../users/events/user-deleted.event";
import { RenamePostWriterToNullCommand } from "../commands/rename-post-writer-to-null.command";
import { CommentAddedEvent } from "../../comments/events/comment-added.event";
import { CommentDeletedEvent } from "../../comments/events/comment-deleted.event";
import {
  IncreaseCommentCountCommand,
  IncreaseType,
} from "../commands/increase-comment-count.command";
import { PostReadCountIncreasedEvent } from "../events/post-read-count-increased.event";
import { IncreaseReadCountCommand } from "../commands/increase-read-count.command";
import { PostDeletedEvent } from "../events/post-deleted.event";
import { DeleteOrphanPostLikesCommand } from "../commands/delete-orphan-post-likes.command";
import { DeleteOrphanPostScrapsCommand } from "../commands/delete-orphan-post-scraps.command";
import { DeleteOrphanPostRankingCommand } from "../commands/delete-orphan-post-ranking.command";

@Injectable()
export class PostsSaga {
  @Saga()
  updatePostWriterToNull = ($events: Observable<any>) =>
    $events.pipe(
      ofType(UserDeletedEvent),
      map(({ nickname }) => new RenamePostWriterToNullCommand(nickname)),
    );

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

  @Saga()
  deleteOrphanPostAggregates = ($events: Observable<any>) =>
    $events.pipe(
      ofType(PostDeletedEvent),
      mergeMap(({ postIdentifier }) => [
        new DeleteOrphanPostLikesCommand(postIdentifier),
        new DeleteOrphanPostScrapsCommand(postIdentifier),
        new DeleteOrphanPostRankingCommand(postIdentifier),
      ]),
    );
}
