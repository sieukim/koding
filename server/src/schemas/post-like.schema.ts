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
  @Prop({ type: Types.ObjectId })
  postId: Types.ObjectId;

  @Prop({ type: String, enum: PostBoardTypes })
  boardType: PostBoardType;

  post?: PostDocument;

  @Prop({ type: String })
  likeUserNickname: string;

  likeUser?: UserDocument;

  createdAt: Date;
}

export const PostLikeSchema = SchemaFactory.createForClass(PostLikeDocument);
PostLikeSchema.index(
  {
    postId: 1,
    likeUserNickname: 1,
    boardType: 1,
  },
  { unique: true },
);
PostLikeSchema.virtual("post", {
  ref: PostDocument.name,
  localField: "postId",
  foreignField: "_id",
  justOne: true,
});
PostLikeSchema.virtual("likeUser", {
  ref: UserDocument.name,
  localField: "likeUser",
  foreignField: "nickname",
  justOne: true,
});
PostLikeSchema.set("toObject", { virtuals: true });
PostLikeSchema.set("toJSON", { virtuals: true });
