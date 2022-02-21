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
import { SortOrder } from "../../common/repository/sort-option";
import { PostDocument } from "../../schemas/post.schema";
import { BackOffPolicy, Retryable } from "typescript-retry-decorator";

@Injectable()
export class PostLikeService {
  constructor(
    @InjectModel(PostLikeDocument.name)
    private readonly postLikeModel: Model<PostLikeDocument>,
    private readonly postsRepository: PostsRepository,
    private readonly eventBus: EventBus,
  ) {}

  // 여러 사용자가 동시에 create 시 발생하는 Duplicate Error 대응용
  @Retryable({
    maxAttempts: 3,
    backOff: 100,
    backOffPolicy: BackOffPolicy.FixedBackOffPolicy,
  })
  async likePost(postIdentifier: PostIdentifier, nickname: string) {
    const { postId, boardType } = postIdentifier;
    const exists = await this.postLikeModel.exists({
      postId: new Types.ObjectId(postId),
      nickname,
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
          nickname,
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
        nickname,
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
        new PostUnlikedEvent(
          postIdentifier,
          nickname,
          deletedPostLike.createdAt,
        ),
      );
    }
  }

  async isUserLikePost(
    { postId, boardType }: PostIdentifier,
    nickname: string,
  ): Promise<boolean> {
    const exists = await this.postLikeModel.exists({
      postId: new Types.ObjectId(postId),
      nickname,
      boardType,
    });
    return exists ?? false;
  }

  async getLikePosts(nickname: string) {
    const likePosts = await this.postLikeModel
      .find({ nickname })
      .sort({ _id: SortOrder.ASC }) // 스크랩한지 오래된 순으로
      .populate({ path: "post", populate: { path: "writer" } })
      .exec();
    return likePosts
      .filter((likePost) => likePost.post !== null)
      .map((likePost) => PostDocument.toModel(likePost.post));
  }

  removeOrphanPostLikes({ postId, boardType }: PostIdentifier) {
    return this.postLikeModel
      .deleteMany({ postId: new Types.ObjectId(postId), boardType })
      .exec();
  }
}
