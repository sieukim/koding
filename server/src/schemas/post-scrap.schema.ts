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
export class PostScrapDocument extends Document {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId })
  postId: Types.ObjectId;

  post?: PostDocument;

  @Prop({ type: String, enum: PostBoardTypes })
  boardType: PostBoardType;

  @Prop({ type: String })
  nickname: string;

  user?: UserDocument;

  createdAt: Date;
}

export const PostScrapSchema = SchemaFactory.createForClass(PostScrapDocument);
PostScrapSchema.index(
  { nickname: 1, postId: 1, boardType: 1 },
  { unique: true },
);
PostScrapSchema.virtual("post", {
  ref: PostDocument.name,
  localField: "postId",
  foreignField: "_id",
  justOne: true,
});
PostScrapSchema.virtual("user", {
  ref: UserDocument.name,
  localField: "nickname",
  foreignField: "nickname",
  justOne: true,
});
PostScrapSchema.set("toJSON", { virtuals: true });
PostScrapSchema.set("toObject", { virtuals: true });
