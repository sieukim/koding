import { Injectable } from "@nestjs/common";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { PostIdentifier } from "../../models/post.model";
import { PostLikeDocument } from "../../schemas/post-like.schema";
import { PostsRepository } from "../posts.repository";
import {
  getCurrentDate,
  getCurrentTime,
  isSameDate,
} from "../../common/utils/time.util";
import { EventBus } from "@nestjs/cqrs";
import { PostLikedEvent } from "../events/post-liked.event";
import { PostUnlikedEvent } from "../events/post-unliked.event";

@Injectable()
export class PostLikeService {
  constructor(
    @InjectModel(PostLikeDocument.name)
    private readonly postLikeModel: Model<PostLikeDocument>,
    private readonly postsRepository: PostsRepository,
    private readonly eventBus: EventBus,
  ) {}

  async likePost(postIdentifier: PostIdentifier, nickname: string) {
    const { postId, boardType } = postIdentifier;
    const exists = await this.postLikeModel.exists({
      postId: new Types.ObjectId(postId),
      likeUserNickname: nickname,
      boardType,
    });
    if (!exists) {
      await Promise.all([
        this.postsRepository.increaseLikeCount({
          postId,
          boardType,
        }),
        this.postLikeModel.create({
          postId: new Types.ObjectId(postId),
          likeUserNickname: nickname,
          boardType,
        }),
      ]);
      this.eventBus.publish(
        new PostLikedEvent(postIdentifier, nickname, getCurrentTime()),
      );
    }
  }

  async unlikePost(postIdentifier: PostIdentifier, nickname: string) {
    const { postId, boardType } = postIdentifier;
    const deletedPostLike = await this.postLikeModel
      .findOneAndDelete({
        postId: new Types.ObjectId(postId),
        likeUserNickname: nickname,
        boardType,
      })
      .exec();
    if (deletedPostLike) {
      if (isSameDate(getCurrentDate(), deletedPostLike.createdAt))
        await this.postsRepository.decreaseLikeCount({
          postId,
          boardType,
        });
      this.eventBus.publish(
        new PostUnlikedEvent(postIdentifier, nickname, getCurrentTime()),
      );
    }
  }

  async isUserLikePost(
    { postId, boardType }: PostIdentifier,
    nickname: string,
  ): Promise<boolean> {
    return this.postLikeModel.exists({
      _id: new Types.ObjectId(postId),
      likeUserNickname: nickname,
      boardType,
    });
  }

  removeOrphanPostLikes({ postId, boardType }: PostIdentifier) {
    return this.postLikeModel
      .deleteMany({ _id: new Types.ObjectId(postId), boardType })
      .exec();
  }
}
