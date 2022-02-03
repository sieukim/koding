import { Injectable } from "@nestjs/common";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { PostIdentifier } from "../../models/post.model";
import { PostLikeDocument } from "../../schemas/post-like.schema";
import { PostsRepository } from "../posts.repository";

@Injectable()
export class PostLikeService {
  constructor(
    @InjectModel(PostLikeDocument.name)
    private readonly postLikeModel: Model<PostLikeDocument>,
    private readonly postsRepository: PostsRepository,
  ) {}

  async likePost({ postId, boardType }: PostIdentifier, nickname: string) {
    await this.postLikeModel
      .updateOne(
        { _id: new Types.ObjectId(postId), boardType },
        {
          $setOnInsert: {
            likeCount: 0,
            boardType,
          },
          $addToSet: { likeUserNicknames: nickname },
        },
        { upsert: true },
      )
      .exec();
    const likeCount = (
      await this.postLikeModel.aggregate([
        {
          $match: { _id: new Types.ObjectId(postId), boardType },
        },
        {
          $project: {
            likeCount: { $size: "$likeUserNicknames" },
          },
        },
      ])
    )[0].likeCount;
    await this.syncLikeCountToPost({ postId, boardType }, likeCount);
    return likeCount;
  }

  async unlikePost({ postId, boardType }: PostIdentifier, nickname: string) {
    await this.postLikeModel
      .updateOne(
        { _id: new Types.ObjectId(postId), boardType },
        {
          $setOnInsert: {
            likeCount: 0,
            boardType,
          },
          $pull: { likeUserNicknames: nickname },
        },
        { upsert: true },
      )
      .exec();
    const likeCount = (
      await this.postLikeModel.aggregate([
        {
          $match: { _id: new Types.ObjectId(postId), boardType },
        },
        {
          $project: {
            likeCount: { $size: "$likeUserNicknames" },
          },
        },
      ])
    )[0].likeCount;
    await this.syncLikeCountToPost({ postId, boardType }, likeCount);
    return likeCount;
  }

  async getLikeCount({ postId, boardType }: PostIdentifier) {
    const postLike = await this.postLikeModel
      .findOne({
        _id: new Types.ObjectId(postId),
        boardType,
      })
      .exec();
    return postLike?.likeCount ?? 0;
  }

  async isUserLikePost(
    { postId, boardType }: PostIdentifier,
    nickname: string,
  ): Promise<boolean> {
    const count = await this.postLikeModel
      .count({
        _id: new Types.ObjectId(postId),
        boardType,
        likeUserNicknames: { $in: nickname },
      })
      .exec();
    return count === 1;
  }

  private syncLikeCountToPost(
    { postId, boardType }: PostIdentifier,
    likeCount: number,
  ) {
    return this.postsRepository.updateOne(
      { postId: { eq: postId }, boardType: { eq: boardType } },
      { likeCount },
    );
  }

  removeOrphanPostLikes({ postId, boardType }: PostIdentifier) {
    return this.postLikeModel
      .deleteMany({ _id: new Types.ObjectId(postId), boardType })
      .exec();
  }
}
