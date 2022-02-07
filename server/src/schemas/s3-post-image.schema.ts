import { Document, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { getCurrentTime } from "../common/utils/time.util";
import { UserDocument } from "./user.schema";
import { PostDocument } from "./post.schema";

@Schema({
  id: false,
  _id: true,
  versionKey: false,
  timestamps: {
    createdAt: true,
    updatedAt: false,
    currentTime: getCurrentTime,
  },
  autoIndex: true,
})
export class S3PostImageDocument extends Document {
  static readonly EXPIRE_HOUR = 2;

  _id: Types.ObjectId;

  @Prop({ required: false, type: Types.ObjectId, ref: PostDocument.name })
  postId: Types.ObjectId | null = null;

  post?: PostDocument;

  @Prop({ type: String })
  s3FileUrl: string;

  @Prop({ type: String })
  s3FileKey: string;

  @Prop({ type: String })
  uploaderNickname: string;

  uploader?: UserDocument;

  createdAt: Date;
}

export const S3PostImageSchema =
  SchemaFactory.createForClass(S3PostImageDocument);
S3PostImageSchema.index({ s3FileUrl: 1 });
S3PostImageSchema.index({ createdAt: 1, postId: 1 });
S3PostImageSchema.virtual("uploader", {
  ref: UserDocument.name,
  foreignField: "nickname",
  localField: "uploaderNickname",
  justOne: true,
});
S3PostImageSchema.virtual("post", {
  ref: PostDocument.name,
  foreignField: "_id",
  localField: "postId",
  justOne: true,
});
S3PostImageSchema.set("toJSON", { virtuals: true });
S3PostImageSchema.set("toObject", { virtuals: true });
