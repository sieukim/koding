import { Document, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { getCurrentTime } from "../common/utils/time.util";
import { UserDocument } from "./user.schema";

@Schema({
  id: false,
  _id: true,
  versionKey: false,
  autoIndex: true,
  timestamps: {
    createdAt: true,
    updatedAt: false,
    currentTime: getCurrentTime,
  },
})
export class S3ProfileAvatarDocument extends Document {
  _id: Types.ObjectId;

  @Prop({ type: String })
  s3FileUrl: string;

  @Prop({ type: String })
  s3BucketName: string;

  @Prop({ type: String })
  s3FileKey: string;

  @Prop({ type: String })
  nickname: string;

  user?: UserDocument;

  createdAt: Date;
}

export const S3ProfileAvatarSchema = SchemaFactory.createForClass(
  S3ProfileAvatarDocument,
);
S3ProfileAvatarSchema.virtual("user", {
  ref: UserDocument.name,
  foreignField: "nickname",
  localField: "nickname",
  justOne: true,
});
S3ProfileAvatarSchema.set("toJSON", { virtuals: true });
S3ProfileAvatarSchema.set("toObject", { virtuals: true });
