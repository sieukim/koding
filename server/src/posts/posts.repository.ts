import { Injectable } from "@nestjs/common";
import { PostDocument } from "../schemas/post.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Post, PostIdentifier } from "../models/post.model";
import { MongooseBaseRepository } from "../common/repository/mongoose-base.repository";
import { IncreaseType } from "./commands/increase-comment-count.command";

@Injectable()
export class PostsRepository extends MongooseBaseRepository<
  Post,
  PostDocument
> {
  constructor(
    @InjectModel(PostDocument.name)
    private readonly postModel: Model<PostDocument>,
  ) {
    super(
      PostDocument.toModel,
      PostDocument.fromModel,
      postModel,
      ["postId"],
      "postId",
    );
  }

  async renameWriter(nickname: string, newNickname: string | null) {
    if (newNickname !== null)
      await this.postModel
        .updateMany(
          { writerNickname: nickname },
          { $set: { writerNickname: newNickname } },
        )
        .exec();
    else
      await this.postModel.updateMany(
        {
          writerNickname: nickname,
        },
        { $unset: { writerNickname: null } },
      );
  }

  async persist(model: Post): Promise<Post> {
    const postDocument = PostDocument.fromModel(model, this.postModel);
    await this.postModel.replaceOne({ _id: postDocument._id }, postDocument, {
      upsert: true,
    });
    return PostDocument.toModel(postDocument);
  }

  async update(model: Post): Promise<Post> {
    const postDocument = PostDocument.fromModel(model, this.postModel);
    const { readCount, ...rest } = postDocument.toJSON(); // 조회수는 원자성 문제로 update시 포함시키지 않음.
    await this.postModel.updateOne({ _id: postDocument._id }, rest); // 조회수를 빼고 업데이트 하므로, replaceOne 대신 updateOne 을 이용
    return PostDocument.toModel(postDocument);
  }

  async remove(post: Post): Promise<boolean> {
    const deleteResult = await this.postModel
      .deleteOne({ boardType: post.boardType, _id: post.postId })
      .exec();
    return deleteResult.deletedCount === 1;
  }

  async increaseReadCount({
    postId,
    boardType,
  }: PostIdentifier): Promise<void> {
    await this.postModel
      .updateOne(
        {
          _id: new Types.ObjectId(postId),
          boardType,
        },
        { $inc: { readCount: 1 } },
      )
      .exec();
    return;
  }

  increaseLikeCount(postIdentifier: PostIdentifier) {
    return this.modifyLikeCount(postIdentifier, IncreaseType.Positive);
  }

  decreaseLikeCount(postIdentifier: PostIdentifier) {
    return this.modifyLikeCount(postIdentifier, IncreaseType.Negative);
  }

  increaseCommentCount(postIdentifier: PostIdentifier) {
    return this.modifyCommentCount(postIdentifier, 1);
  }

  decreaseCommentCount(postIdentifier: PostIdentifier) {
    return this.modifyCommentCount(postIdentifier, -1);
  }

  increaseScrapCount(postIdentifier: PostIdentifier) {
    return this.modifyScrapCount(postIdentifier, 1);
  }

  decreaseScrapCount(postIdentifier: PostIdentifier) {
    return this.modifyScrapCount(postIdentifier, -1);
  }

  private async modifyLikeCount(
    { postId, boardType }: PostIdentifier,
    delta: 1 | -1,
  ) {
    const findOption = this.parseFindOption({
      postId: { eq: postId },
      boardType: { eq: boardType },
    });
    const post = await this.postModel
      .findOneAndUpdate(
        findOption,
        { $inc: { likeCount: delta } },
        { returnOriginal: false },
      )
      .exec();
    return post.likeCount;
  }

  private modifyCommentCount(
    { postId, boardType }: PostIdentifier,
    delta: 1 | -1,
  ) {
    return this.postModel.updateOne(
      {
        _id: new Types.ObjectId(postId),
        boardType,
      },
      { $inc: { commentCount: delta } },
    );
  }

  private modifyScrapCount(
    { postId, boardType }: PostIdentifier,
    delta: 1 | -1,
  ) {
    return this.postModel.updateOne(
      {
        _id: new Types.ObjectId(postId),
        boardType,
      },
      { $inc: { scrapCount: delta } },
    );
  }

  async findByPostId(identifier: PostIdentifier): Promise<Post | null> {
    const { postId, boardType } = identifier;
    const post = await this.findOne({
      postId: { eq: postId },
      boardType: { eq: boardType },
    });
    if (!post) return null;
    return post;
  }
}
