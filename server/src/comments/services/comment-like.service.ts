import { Injectable } from "@nestjs/common";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { PostIdentifier } from "../../models/post.model";
import {
  getCurrentDate,
  getCurrentTime,
  isSameDate,
} from "../../common/utils/time.util";
import { EventBus } from "@nestjs/cqrs";
import { SortType } from "../../common/repository/sort-option";
import { CommentUnlikedEvent } from "../events/comment-unliked.event";
import { CommentLikedEvent } from "../events/comment-liked.event";
import { CommentsRepository } from "../comments.repository";
import { CommentLikeDocument } from "../../schemas/comment-like.schema";
import { CommentDocument } from "../../schemas/comment.schema";
import { isEmpty, isString } from "class-validator";

@Injectable()
export class CommentLikeService {
  constructor(
    @InjectModel(CommentLikeDocument.name)
    private readonly commentLikeModel: Model<CommentLikeDocument>,
    private readonly commentsRepository: CommentsRepository,
    private readonly eventBus: EventBus,
  ) {}

  async likeComment(
    { postId, boardType }: PostIdentifier,
    commentId: string,
    nickname: string,
  ) {
    const exists = await this.commentLikeModel.exists({
      commentId: new Types.ObjectId(commentId),
      nickname,
      postId: new Types.ObjectId(postId),
      boardType,
    });
    if (!exists) {
      await Promise.all([
        this.commentsRepository.increaseLikeCount(commentId),
        this.commentLikeModel.create({
          commentId: new Types.ObjectId(commentId),
          nickname,
          postId: new Types.ObjectId(postId),
          boardType,
        }),
      ]);
      this.eventBus.publish(
        new CommentLikedEvent(commentId, nickname, getCurrentTime()),
      );
    }
  }

  async unlikeComment(
    { postId, boardType }: PostIdentifier,
    commentId: string,
    nickname: string,
  ) {
    const deletedCommentLike = await this.commentLikeModel
      .findOneAndDelete({
        commentId: new Types.ObjectId(commentId),
        nickname,
        postId: new Types.ObjectId(postId),
        boardType,
      })
      .exec();
    if (deletedCommentLike) {
      if (isSameDate(getCurrentDate(), deletedCommentLike.createdAt))
        await this.commentsRepository.decreaseLikeCount(commentId);
      this.eventBus.publish(
        new CommentUnlikedEvent(
          commentId,
          nickname,
          deletedCommentLike.createdAt,
        ),
      );
    }
  }

  async isUserLikeComment(
    commentId: string,
    nickname: string,
  ): Promise<boolean> {
    return this.commentLikeModel.exists({
      commentId: new Types.ObjectId(commentId),
      nickname,
    });
  }

  async userLikeCommentsSet(commentIds: string[], nickname: string) {
    if (isEmpty(nickname) || commentIds.length === 0) return new Set();
    const commentLikes = await this.commentLikeModel
      .find({
        commentId: { $in: commentIds.map((id) => new Types.ObjectId(id)) },
        nickname,
      })
      .exec();
    return new Set(
      commentLikes.map((commentLike) => commentLike.commentId.toString()),
    );
  }

  async getLikeComments(nickname: string) {
    const likePosts = await this.commentLikeModel
      .find({ nickname })
      .sort({ _id: SortType.ASC }) // 스크랩한지 오래된 순으로
      .populate("comment")
      .exec();
    return likePosts
      .filter((likeComment) => likeComment.comment !== null)
      .map((likeComment) => CommentDocument.toModel(likeComment.comment));
  }

  removeOrphanCommentLikes(commentId: string);
  removeOrphanCommentLikes({ postId, boardType }: PostIdentifier);
  removeOrphanCommentLikes(commentIdOrPostId: PostIdentifier | string) {
    if (isString(commentIdOrPostId)) {
      return this.commentLikeModel
        .deleteMany({
          commentId: new Types.ObjectId(commentIdOrPostId),
        })
        .exec();
    } else {
      const { postId, boardType } = commentIdOrPostId;
      return this.commentLikeModel
        .deleteMany({ postId: new Types.ObjectId(postId), boardType })
        .exec();
    }
  }
}
