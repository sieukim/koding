import { Document, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { getCurrentUTCTime } from "../common/utils/time.util";
import { UserDocument } from "./user.schema";
import { PostDocument } from "./post.schema";

@Schema({
  id: false,
  _id: true,
  versionKey: false,
  timestamps: {
    createdAt: true,
    updatedAt: false,
    currentTime: getCurrentUTCTime,
  },
  autoIndex: true,
})
export class S3Image extends Document {
  static readonly EXPIRE_HOUR = 2;

  _id: Types.ObjectId;

  @Prop({ required: false, type: Types.ObjectId, ref: PostDocument.name })
  postId: Types.ObjectId | null = null;

  post?: PostDocument;

  @Prop({ type: String })
  s3FileUrl: string;

  @Prop({ type: String })
  s3BucketName: string;

  @Prop({ type: String })
  s3FileKey: string;

  @Prop({ type: String })
  uploaderNickname: string;

  uploader?: UserDocument;

  createdAt: Date;
}

export const S3ImageSchema = SchemaFactory.createForClass(S3Image);
S3ImageSchema.index({ s3FileUrl: 1, postId: 1 });
S3ImageSchema.virtual("uploader", {
  ref: UserDocument.name,
  foreignField: "nickname",
  localField: "uploaderNickname",
  justOne: true,
});
S3ImageSchema.set("toJSON", { virtuals: true });
S3ImageSchema.set("toObject", { virtuals: true });
