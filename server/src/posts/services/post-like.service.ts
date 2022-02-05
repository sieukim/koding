import { Injectable } from "@nestjs/common";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { PostIdentifier } from "../../models/post.model";
import { PostLikeDocument } from "../../schemas/post-like.schema";
import { PostsRepository } from "../posts.repository";
import { PostRankingService } from "./post-ranking.service";
import { getCurrentDate, isSameDate } from "../../common/utils/time.util";

@Injectable()
export class PostLikeService {
  constructor(
    @InjectModel(PostLikeDocument.name)
    private readonly postLikeModel: Model<PostLikeDocument>,
    private readonly postsRepository: PostsRepository,
    private readonly postLikeRankingService: PostRankingService,
  ) {}

  async likePost({ postId, boardType }: PostIdentifier, nickname: string) {
    console.log("likePost callend", postId, boardType);
    const exists = await this.postLikeModel.exists({
      postId: new Types.ObjectId(postId),
      boardType,
      likeUserNickname: nickname,
    });
    if (!exists) {
      const [likeCount] = await Promise.all([
        this.postsRepository.increaseLikeCount({
          postId,
          boardType,
        }),
        this.postLikeModel.create({
          postId: new Types.ObjectId(postId),
          likeUserNickname: nickname,
          boardType,
        }),
        this.postLikeRankingService.increaseDailyLikeCount({
          postId,
          boardType,
        }),
      ]);
      return likeCount;
    } else {
      const post = await this.postsRepository.findByPostId({
        postId,
        boardType,
      });
      return post.likeCount;
    }
  }

  async unlikePost({ postId, boardType }: PostIdentifier, nickname: string) {
    const deletedPostLike = await this.postLikeModel
      .findOneAndDelete({
        postId: new Types.ObjectId(postId),
        likeUserNickname: nickname,
        boardType,
      })
      .exec();
    if (deletedPostLike) {
      if (isSameDate(getCurrentDate(), deletedPostLike.createdAt))
        this.postLikeRankingService.decreaseDailyLikeCount({
          postId,
          boardType,
        });
      return this.postsRepository.decreaseLikeCount({
        postId,
        boardType,
      });
    } else {
      const post = await this.postsRepository.findByPostId({
        postId,
        boardType,
      });
      return post.likeCount;
    }
  }

  async isUserLikePost(
    { postId, boardType }: PostIdentifier,
    nickname: string,
  ): Promise<boolean> {
    return this.postLikeModel.exists({
      _id: new Types.ObjectId(postId),
      boardType,
      likeUserNickname: nickname,
    });
  }

  removeOrphanPostLikes({ postId, boardType }: PostIdentifier) {
    return this.postLikeModel
      .deleteMany({ _id: new Types.ObjectId(postId), boardType })
      .exec();
  }
}
