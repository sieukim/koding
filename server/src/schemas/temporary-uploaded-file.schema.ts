import { Document, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { currentTime } from "../common/utils/current-time.util";
import { UserDocument } from "./user.schema";

@Schema({
  id: false,
  _id: true,
  versionKey: false,
  timestamps: { createdAt: true, updatedAt: false, currentTime },
  autoIndex: true,
})
export class TemporaryUploadedFile extends Document {
  static readonly EXPIRE_HOUR = 2;

  _id: Types.ObjectId;

  @Prop({ type: String })
  s3FileUrl: string;

  @Prop({ type: String })
  s3BucketName: string;

  @Prop({ type: String })
  s3FileKey: string;

  @Prop({ type: String })
  writerNickname: string;

  writer?: UserDocument;

  createdAt: Date;
}

export const TemporaryUploadedFileSchema = SchemaFactory.createForClass(
  TemporaryUploadedFile,
);
TemporaryUploadedFileSchema.index({ s3FileUrl: 1, writerNickname: 1 });
TemporaryUploadedFileSchema.virtual("writer", {
  ref: UserDocument.name,
  foreignField: "nickname",
  localField: "writerNickname",
  justOne: true,
});
TemporaryUploadedFileSchema.set("toJSON", { virtuals: true });
TemporaryUploadedFileSchema.set("toObject", { virtuals: true });
