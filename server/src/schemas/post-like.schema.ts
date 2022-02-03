import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { PostDocument } from "./post.schema";
import { Document, Types } from "mongoose";
import { PostBoardType, PostBoardTypes } from "../models/post.model";

@Schema({
  _id: true,
  id: false,
  autoIndex: true,
  versionKey: false,
})
export class PostLikeDocument extends Document {
  postId: string;

  @Prop({ type: String, enum: PostBoardTypes })
  boardType: PostBoardType;

  post?: PostDocument;

  @Prop({ type: [String], default: [] })
  likeUserNicknames: string[];

  @Prop({ type: Number, default: 0, min: 0 })
  likeCount = 0;
}

export const PostLikeSchema = SchemaFactory.createForClass(PostLikeDocument);
PostLikeSchema.index({});
PostLikeSchema.virtual("post", {
  ref: PostDocument.name,
  localField: "postId",
  foreignField: "_id",
  justOne: true,
});
PostLikeSchema.virtual("postId")
  .get(function () {
    return this._id.toString();
  })
  .set(function (value) {
    if (value instanceof Types.ObjectId) this._id = value;
    else this._id = new Types.ObjectId(value);
  });
PostLikeSchema.set("toObject", { virtuals: true });
PostLikeSchema.set("toJSON", { virtuals: true });
