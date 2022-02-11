import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { PostDocument } from "./post.schema";
import { Document, Types } from "mongoose";
import { PostBoardType, PostBoardTypes } from "../models/post.model";
import { UserDocument } from "./user.schema";
import { getCurrentTime } from "../common/utils/time.util";
import { CommentDocument } from "./comment.schema";

@Schema({
  _id: true,
  id: false,
  autoIndex: true,
  versionKey: false,
  timestamps: {
    createdAt: true,
    updatedAt: false,
    currentTime: getCurrentTime,
  },
})
export class CommentLikeDocument extends Document {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId })
  commentId: Types.ObjectId;

  comment?: CommentDocument;

  @Prop({ type: Types.ObjectId })
  postId: Types.ObjectId;

  @Prop({ type: String, enum: PostBoardTypes })
  boardType: PostBoardType;

  post?: PostDocument;

  @Prop({ type: String })
  nickname: string;

  user?: UserDocument;

  createdAt: Date;
}

export const CommentLikeSchema =
  SchemaFactory.createForClass(CommentLikeDocument);
CommentLikeSchema.index(
  // 댓글 좋아요, 좋아요 취소, 좋아요 여부 조회 ,고아 도큐먼트 삭제 시
  {
    commentId: 1,
    nickname: 1,
  },
  { unique: true },
);
CommentLikeSchema.index({
  // 사용자가 좋아요한 댓글들 조회 시
  nickname: 1,
  _id: 1,
});
CommentLikeSchema.virtual("comment", {
  ref: CommentDocument.name,
  localField: "commentId",
  foreignField: "_id",
  justOne: true,
});
CommentLikeSchema.virtual("post", {
  ref: PostDocument.name,
  localField: "postId",
  foreignField: "_id",
  justOne: true,
});
CommentLikeSchema.virtual("user", {
  ref: UserDocument.name,
  localField: "nickname",
  foreignField: "nickname",
  justOne: true,
});
CommentLikeSchema.set("toObject", { virtuals: true });
CommentLikeSchema.set("toJSON", { virtuals: true });
