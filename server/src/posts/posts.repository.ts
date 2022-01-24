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
