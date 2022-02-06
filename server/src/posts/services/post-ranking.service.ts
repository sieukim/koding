import { Injectable } from "@nestjs/common";
import { Model, Types } from "mongoose";
import { PostBoardType, PostIdentifier } from "../../models/post.model";
import { getCurrentDate } from "../../common/utils/time.util";
import { PostDailyRankingDocument } from "../../schemas/post-daliy-ranking.schema";
import { SortType } from "../../common/repository/sort-option";
import { InjectModel } from "@nestjs/mongoose";
import { IncreaseType } from "../commands/increase-comment-count.command";

@Injectable()
export class PostRankingService {
  constructor(
    @InjectModel(PostDailyRankingDocument.name)
    private readonly dailyRankingModel: Model<PostDailyRankingDocument>,
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

  async getDailyRanking(boardType: PostBoardType, pageSize) {
    const currentDate = getCurrentDate();
    const dailyRankings = await this.dailyRankingModel
      .find({ aggregateDate: currentDate, boardType, popularity: { $gt: 0 } })
      .sort({ popularity: SortType.DESC, postId: SortType.DESC })
      .populate("post")
      .limit(pageSize)
      .exec();
    console.log("dailyRankings", dailyRankings);
    return dailyRankings
      .map((dailyRanking) => dailyRanking.post)
      .filter((post) => post != null);
  }

  private async modifyAggregateField(
    fieldName: keyof PostDailyRankingDocument &
      ("likeCount" | "readCount" | "scrapCount" | "commentCount"),
    { postId, boardType }: PostIdentifier,
    delta: IncreaseType,
  ) {
    const currentDate = getCurrentDate();
    const popularityDelta = this.resolvePopularityWeight(fieldName) * delta;
    await this.dailyRankingModel.updateOne(
      {
        postId: new Types.ObjectId(postId),
        aggregateDate: currentDate,
        boardType,
      },
      {
        $inc: { [fieldName]: delta, popularity: popularityDelta },
      },
      { upsert: delta === IncreaseType.Positive },
    );
  }

  private resolvePopularityWeight(
    fieldName: keyof PostDailyRankingDocument &
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

  removeOrphanPostRanking({ postId, boardType }: PostIdentifier) {
    return this.dailyRankingModel
      .deleteMany({ postId: new Types.ObjectId(postId), boardType })
      .exec();
  }
}
