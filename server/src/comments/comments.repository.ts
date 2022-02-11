import { Injectable } from "@nestjs/common";
import { Model, Types } from "mongoose";
import { CommentDocument } from "../schemas/comment.schema";
import { Comment } from "../models/comment.model";
import { MongooseBaseRepository } from "../common/repository/mongoose-base.repository";
import { InjectModel } from "@nestjs/mongoose";
import { PostIdentifier } from "../models/post.model";
import { IncreaseType } from "../posts/commands/increase-comment-count.command";

@Injectable()
export class CommentsRepository extends MongooseBaseRepository<
  Comment,
  CommentDocument
> {
  constructor(
    @InjectModel(CommentDocument.name)
    private readonly commentModel: Model<CommentDocument>,
  ) {
    super(
      CommentDocument.toModel,
      CommentDocument.fromModel,
      commentModel,
      ["commentId", "postId"],
      "commentId",
    );
  }

  async renameWriter(nickname: string, newNickname: string | null) {
    if (newNickname !== null)
      await this.commentModel
        .updateMany(
          { writerNickname: nickname },
          { $set: { writerNickname: newNickname } },
        )
        .exec();
    else
      await this.commentModel.updateMany(
        {
          writerNickname: nickname,
        },
        { $unset: { writerNickname: null } },
      );
  }

  async persist(model: Comment): Promise<Comment> {
    const commentDocument = CommentDocument.fromModel(model, this.commentModel);
    await this.commentModel.updateOne(
      { _id: commentDocument._id },
      commentDocument,
      { upsert: true },
    );
    return CommentDocument.toModel(commentDocument);
  }

  async update(model: Comment): Promise<Comment> {
    const commentDocument = CommentDocument.fromModel(model, this.commentModel);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { likeCount, ...rest } = commentDocument.toJSON();
    await this.commentModel.updateOne({ _id: commentDocument._id }, rest, {
      overwrite: true,
    });
    return CommentDocument.toModel(commentDocument);
  }

  findByCommentId(commentId: string) {
    return this.findOne({ commentId: { eq: commentId } });
  }

  async remove(comment: Comment) {
    const deleteResult = await this.commentModel
      .deleteOne({ _id: comment.commentId })
      .exec();
    return deleteResult.deletedCount === 1;
  }

  async removeComments({ postId }: PostIdentifier) {
    const deletedResult = await this.commentModel
      .deleteMany({
        postId: new Types.ObjectId(postId),
      })
      .exec();
    return deletedResult.deletedCount;
  }

  increaseLikeCount(commentId: string) {
    return this.increaseField("likeCount", commentId, IncreaseType.Positive);
  }

  decreaseLikeCount(commentId: string) {
    return this.increaseField("likeCount", commentId, IncreaseType.Negative);
  }

  private async increaseField(
    fieldName: keyof Comment,
    commentId: string,
    delta: IncreaseType,
  ) {
    await this.commentModel
      .updateOne(this.parseFindOption({ commentId: { eq: commentId } }), {
        $inc: { [fieldName]: delta },
      })
      .exec();
  }
}
