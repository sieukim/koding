import { Injectable } from "@nestjs/common";
import { PostIdentifier } from "../../entities/post.entity";
import { getCurrentDate } from "../../common/utils/time.util";
import { IncreaseType } from "../commands/increase-comment-count.command";
import { InjectEntityManager } from "@nestjs/typeorm";
import { PostDailyRanking } from "../../entities/post-daily-ranking.entity";
import { EntityManager } from "typeorm";

@Injectable()
export class PostRankingService {
  constructor(
    @InjectEntityManager()
    private readonly em: EntityManager,
  ) {}

  increaseDailyLikeCount(postIdentifier: PostIdentifier) {
    return this.modifyAggregateField(
      "likeCount",
      postIdentifier,
      IncreaseType.Positive,
    );
  }

  decreaseDailyLikeCount(postIdentifier: PostIdentifier) {
    return this.modifyAggregateField(
      "likeCount",
      postIdentifier,
      IncreaseType.Negative,
    );
  }

  increaseDailyCommentCount(postIdentifier: PostIdentifier) {
    return this.modifyAggregateField(
      "commentCount",
      postIdentifier,
      IncreaseType.Positive,
    );
  }

  decreaseDailyCommentCount(postIdentifier: PostIdentifier) {
    return this.modifyAggregateField(
      "commentCount",
      postIdentifier,
      IncreaseType.Negative,
    );
  }

  increaseDailyScrapCount(postIdentifier: PostIdentifier) {
    return this.modifyAggregateField(
      "scrapCount",
      postIdentifier,
      IncreaseType.Positive,
    );
  }

  decreaseDailyScrapCount(postIdentifier: PostIdentifier) {
    return this.modifyAggregateField(
      "scrapCount",
      postIdentifier,
      IncreaseType.Negative,
    );
  }

  increaseDailyReadCount(postIdentifier: PostIdentifier) {
    return this.modifyAggregateField(
      "readCount",
      postIdentifier,
      IncreaseType.Positive,
    );
  }

  private async modifyAggregateField(
    fieldName: keyof PostDailyRanking &
      ("likeCount" | "readCount" | "scrapCount" | "commentCount"),
    { postId, boardType }: PostIdentifier,
    delta: IncreaseType,
  ) {
    return this.em.transaction(async (em) => {
      const currentDate = getCurrentDate();
      const popularityDelta = this.resolvePopularityWeight(fieldName) * delta;
      let postRanking = await em.findOne(PostDailyRanking, {
        postId,
        aggregateDate: currentDate,
      });
      if (postRanking) {
        postRanking[fieldName]++;
        postRanking.popularity += popularityDelta;
        await em.save(postRanking, { reload: false });
      } else {
        postRanking = new PostDailyRanking({
          postId,
          boardType,
          aggregateDate: currentDate,
        });
        postRanking[fieldName]++;
        postRanking.popularity += popularityDelta;
        await em.save(postRanking, { reload: false });
      }
    });
  }

  private resolvePopularityWeight(
    fieldName: keyof PostDailyRanking &
      ("likeCount" | "readCount" | "scrapCount" | "commentCount"),
  ) {
    switch (fieldName) {
      case "likeCount":
      case "scrapCount":
        return 3;
      case "commentCount":
        return 2;
      case "readCount":
        return 1;
    }
  }
}
