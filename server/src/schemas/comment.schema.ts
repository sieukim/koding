import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { currentTime } from "../common/utils/current-time.util";
import { Document, Model, Types } from "mongoose";
import { UserDocument } from "./user.schema";
import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { PartialUser } from "../models/user.model";
import { Comment } from "../models/comment.model";
import { PostDocument } from "./post.schema";

@Schema({
  id: false,
  _id: true,
  versionKey: false,
  timestamps: { createdAt: true, updatedAt: false, currentTime: currentTime },
})
export class CommentDocument extends Document {
  // @Prop({ type: Types.ObjectId })
  // _id: Types.ObjectId;

  commentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId })
  postId: Types.ObjectId;

  post?: PostDocument;

  @Prop({ type: String })
  writerNickname: string;

  writer?: UserDocument;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: "댓글 내용",
  })
  @Prop()
  content: string;

  @ApiProperty({
    description: "댓글 생성 시간",
  })
  createdAt: Date;

  @Prop({
    type: [String],
  })
  mentionedUserNicknames: string[];

  mentionedUsers?: UserDocument[];

  static toModel(commentDocument: CommentDocument): Comment {
    const {
      commentId,
      postId,
      writer,
      post,
      mentionedUsers,
      mentionedUserNicknames,
      content,
      createdAt,
      writerNickname,
    } = commentDocument;
    return new Comment({
      content,
      createdAt,
      writerNickname,
      commentId: commentId.toString(),
      postId: postId.toString(),
      writer: writer && UserDocument.toModel(writer),
      post: post && PostDocument.toModel(post),
      mentionedUsers: mentionedUsers
        ? mentionedUsers.map(UserDocument.toModel)
        : mentionedUserNicknames.map(
            (nickname) => new PartialUser({ nickname }),
          ),
    });
  }

  static fromModel(
    comment: Comment,
    model: Model<CommentDocument>,
  ): CommentDocument {
    const {
      commentId,
      postId,
      mentionedUsers,
      writerNickname,
      content,
      createdAt,
    } = comment;
    return new model({
      writerNickname,
      content,
      createdAt,
      commentId: new Types.ObjectId(commentId),
      postId: new Types.ObjectId(postId),
      mentionedUserNicknames: mentionedUsers.map(({ nickname }) => nickname),
    });
  }
}

export const CommentSchema = SchemaFactory.createForClass(CommentDocument);
CommentSchema.index({ postId: 1, _id: 1 });
CommentSchema.virtual("post", {
  ref: PostDocument.name,
  localField: "postId",
  foreignField: "_id",
  justOne: true,
});
CommentSchema.virtual("writer", {
  ref: UserDocument.name,
  localField: "writerNickname",
  foreignField: "nickname",
  justOne: true,
});
CommentSchema.virtual("mentionedUsers", {
  ref: UserDocument.name,
  localField: "mentionedUserNicknames",
  foreignField: "nickname",
});
CommentSchema.virtual("commentId")
  .get(function () {
    return this._id;
  })
  .set(function (value) {
    if (value instanceof Types.ObjectId) this._id = value;
    else this._id = new Types.ObjectId(value);
  });
CommentSchema.set("toObject", { virtuals: true });
CommentSchema.set("toJSON", { virtuals: true });
