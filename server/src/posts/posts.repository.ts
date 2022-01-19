import { Injectable } from "@nestjs/common";
import { PostDocument } from "../schemas/post.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Post, PostIdentifier } from "../models/post.model";
import { MongooseBaseRepository } from "../common/repository/mongoose-base.repository";

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

  async persist(model: Post): Promise<Post> {
    const postDocument = PostDocument.fromModel(model, this.postModel);
    const {
      _id,
      createdAt,
      writerNickname,
      boardType,
      markdownContent,
      title,
      readCount,
      tags,
      imageUrls,
    } = postDocument.toJSON();
    await this.postModel.updateOne(
      { _id },
      {
        createdAt,
        writerNickname,
        boardType,
        markdownContent,
        title,
        readCount,
        tags,
        imageUrls,
      },
      { upsert: true },
    );
    return PostDocument.toModel(postDocument);
  }

  async update(model: Post): Promise<Post> {
    const postDocument = PostDocument.fromModel(model, this.postModel);
    const {
      _id,
      createdAt,
      writerNickname,
      boardType,
      markdownContent,
      title,
      readCount,
      tags,
      imageUrls,
    } = postDocument.toJSON();
    await this.postModel.updateOne(
      { _id },
      {
        createdAt,
        writerNickname,
        boardType,
        markdownContent,
        title,
        readCount,
        tags,
        imageUrls,
      },
    );
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
          postId,
          boardType,
        },
        { $inc: { readCount: 1 } },
      )
      .exec();
    return;
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
