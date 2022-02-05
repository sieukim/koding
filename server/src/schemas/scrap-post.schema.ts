import { Document, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { getCurrentTime } from "../common/utils/time.util";
import { UserDocument } from "./user.schema";
import { PostDocument } from "./post.schema";
import { PostBoardType, PostBoardTypes } from "../models/post.model";

@Schema({
  id: true,
  _id: false,
  autoIndex: true,
  versionKey: false,
  timestamps: {
    createdAt: true,
    updatedAt: false,
    currentTime: getCurrentTime,
  },
})
export class ScrapPostDocument extends Document {
  @Prop({ type: Types.ObjectId })
  postId: Types.ObjectId;

  post?: PostDocument;

  @Prop({ type: String, enum: PostBoardTypes })
  boardType: PostBoardType;

  @Prop({ type: String })
  nickname: string;

  user?: UserDocument;
}

export const ScrapPostSchema = SchemaFactory.createForClass(ScrapPostDocument);
ScrapPostSchema.index({ nickname: 1, postId: 1 });
ScrapPostSchema.virtual("post", {
  ref: PostDocument.name,
  localField: "postId",
  foreignField: "_id",
  justOne: true,
});
ScrapPostSchema.virtual("user", {
  ref: UserDocument.name,
  localField: "nickname",
  foreignField: "nickname",
  justOne: true,
});
ScrapPostSchema.set("toJSON", { virtuals: true });
ScrapPostSchema.set("toObject", { virtuals: true });
