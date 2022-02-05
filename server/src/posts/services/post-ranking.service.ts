import { Injectable } from "@nestjs/common";
import { Model, Types } from "mongoose";
import { PostBoardType, PostIdentifier } from "../../models/post.model";
import { getCurrentDate } from "../../common/utils/time.util";
import { PostLikeDailyRankingDocument } from "../../schemas/post-like-daliy-ranking.schema";
import { SortType } from "../../common/repository/sort-option";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class PostRankingService {
  constructor(
    @InjectModel(PostLikeDailyRankingDocument.name)
    private readonly dailyRankingModel: Model<PostLikeDailyRankingDocument>,
  ) {}

  async increaseDailyLikeCount({ postId, boardType }: PostIdentifier) {
    const currentDate = getCurrentDate();
    await this.dailyRankingModel.updateOne(
      {
        postId: new Types.ObjectId(postId),
        boardType,
        aggregateDate: currentDate,
      },
      {
        $inc: { likeCount: 1 },
      },
      {
        upsert: true,
      },
    );
  }

  async decreaseDailyLikeCount({ postId, boardType }: PostIdentifier) {
    const currentDate = getCurrentDate();
    await this.dailyRankingModel.updateOne(
      {
        postId: new Types.ObjectId(postId),
        aggregateDate: currentDate,
        boardType,
      },
      {
        $inc: { likeCount: -1 },
      },
    );
  }

  async getDailyRanking(boardType: PostBoardType, pageSize) {
    const currentDate = getCurrentDate();
    const dailyRankings = await this.dailyRankingModel
      .find({ aggregateDate: currentDate, boardType, likeCount: { $gte: 0 } })
      .sort({ likeCount: SortType.DESC, postId: SortType.DESC })
      .populate("post")
      .limit(pageSize)
      .exec();
    console.log("dailyRankings", dailyRankings);
    return dailyRankings.map((dailyRanking) => dailyRanking.post);
  }
}
