import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { PostReadCountIncreasedEvent } from "../post-read-count-increased.event";
import { PostLikedEvent } from "../post-liked.event";
import { PostUnlikedEvent } from "../post-unliked.event";
import { PostScrappedEvent } from "../post-scrapped.event";
import { PostUnscrappedEvent } from "../post-unscrapped.event";
import { CommentAddedEvent } from "../../../comments/events/comment-added.event";
import { CommentDeletedEvent } from "../../../comments/events/comment-deleted.event";
import { PostRankingService } from "../../services/post-ranking.service";
import { getCurrentDate, isSameDate } from "../../../common/utils/time.util";

const events = [
  PostReadCountIncreasedEvent,
  PostLikedEvent,
  PostUnlikedEvent,
  PostScrappedEvent,
  PostUnscrappedEvent,
  CommentAddedEvent,
  CommentDeletedEvent,
] as const;

@EventsHandler(...events)
export class SyncPostAggregateInfoHandler
  implements IEventHandler<InstanceType<typeof events[number]>>
{
  constructor(private readonly postRankingService: PostRankingService) {}

  handle(event: InstanceType<typeof events[number]>) {
    const { postIdentifier } = event;
    const currentDate = getCurrentDate();
    if (event instanceof PostReadCountIncreasedEvent) {
      return this.postRankingService.increaseDailyReadCount(postIdentifier);
    } else if (event instanceof PostLikedEvent) {
      if (isSameDate(currentDate, event.likeDate))
        return this.postRankingService.increaseDailyLikeCount(postIdentifier);
    } else if (event instanceof PostUnlikedEvent) {
      if (isSameDate(currentDate, event.unlikeDate))
        return this.postRankingService.decreaseDailyLikeCount(postIdentifier);
    } else if (event instanceof PostScrappedEvent) {
      if (isSameDate(currentDate, event.scrapDate))
        return this.postRankingService.increaseDailyScrapCount(postIdentifier);
    } else if (event instanceof PostUnscrappedEvent) {
      if (isSameDate(currentDate, event.scrapDate))
        return this.postRankingService.decreaseDailyScrapCount(postIdentifier);
    } else if (event instanceof CommentAddedEvent) {
      if (isSameDate(currentDate, event.commentCreatedAt))
        return this.postRankingService.increaseDailyCommentCount(
          postIdentifier,
        );
    } else if (event instanceof CommentDeletedEvent) {
      if (isSameDate(currentDate, event.commentCreatedAt))
        return this.postRankingService.decreaseDailyCommentCount(
          postIdentifier,
        );
    }
  }
}
