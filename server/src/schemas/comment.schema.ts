import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { getCurrentTime } from "../common/utils/time.util";
import { Document, Model, Types } from "mongoose";
import { UserDocument } from "./user.schema";
import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Comment } from "../models/comment.model";
import { PostDocument } from "./post.schema";
import { Expose, plainToClass, Type } from "class-transformer";
import { PostBoardType, PostBoardTypes } from "../models/post.model";

@Expose({ toClassOnly: true })
@Schema({
  id: false,
  _id: true,
  versionKey: false,
  timestamps: {
    createdAt: true,
    updatedAt: false,
    currentTime: getCurrentTime,
  },
})
export class CommentDocument extends Document {
  commentId: string;

  @Prop({
    type: Types.ObjectId,
    get: (value: Types.ObjectId) => value.toString(),
    set: (value: Types.ObjectId | string) =>
      value instanceof Types.ObjectId ? value : new Types.ObjectId(value),
  })
  postId: Types.ObjectId;

  @Type(() => PostDocument)
  post?: PostDocument;

  @Prop({
    type: String,
    enum: PostBoardTypes,
  })
  boardType: PostBoardType;

  @Prop({ type: String, required: false })
  writerNickname?: string;

  @Type(() => UserDocument)
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

  @Prop({ type: Number, default: 0 })
  likeCount: number;

  @Prop({
    type: [String],
  })
  mentionedNicknames: string[];

  @Type(() => UserDocument)
  mentionedUsers?: UserDocument[];

  static toModel(commentDocument: CommentDocument): Comment {
    return plainToClass(Comment, commentDocument, {
      excludeExtraneousValues: true,
    });
  }

  static fromModel(
    comment: Comment,
    model: Model<CommentDocument>,
  ): CommentDocument {
    return new model(comment);
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
    return this._id.toString();
  })
  .set(function (value) {
    if (value instanceof Types.ObjectId) this._id = value;
    else this._id = new Types.ObjectId(value);
  });

CommentSchema.set("toObject", { virtuals: true });
CommentSchema.set("toJSON", { virtuals: true });
