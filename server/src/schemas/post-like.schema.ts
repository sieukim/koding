import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { PostDocument } from "./post.schema";
import { Document, Types } from "mongoose";
import { PostBoardType, PostBoardTypes } from "../models/post.model";
import { UserDocument } from "./user.schema";
import { getCurrentTime } from "../common/utils/time.util";

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
export class PostLikeDocument extends Document {
  _id: Types.ObjectId;

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

export const PostLikeSchema = SchemaFactory.createForClass(PostLikeDocument);
PostLikeSchema.index(
  // 게시글 좋아요, 좋아요 취소, 좋아요 여부 조회 ,고아 도큐먼트 삭제 시
  {
    postId: 1,
    nickname: 1,
    boardType: 1,
  },
  { unique: true },
);
PostLikeSchema.index({
  // 사용자가 좋아요한 게시글들 조회 시
  nickname: 1,
  _id: 1,
});
PostLikeSchema.virtual("post", {
  ref: PostDocument.name,
  localField: "postId",
  foreignField: "_id",
  justOne: true,
});
PostLikeSchema.virtual("user", {
  ref: UserDocument.name,
  localField: "nickname",
  foreignField: "nickname",
  justOne: true,
});
PostLikeSchema.set("toObject", { virtuals: true });
PostLikeSchema.set("toJSON", { virtuals: true });
