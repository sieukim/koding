import { Document, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { PostBoardType } from "../models/post.model";

@Schema({ _id: true, id: false, autoIndex: true, versionKey: false })
export class CertifiedTagDocument extends Document {
  _id: Types.ObjectId;

  @Prop({ type: String })
  boardType: PostBoardType;

  @Prop({ type: String })
  tag: string;
}

export const CertifiedTagSchema =
  SchemaFactory.createForClass(CertifiedTagDocument);
CertifiedTagSchema.index({ tag: 1, boardType: 1 }, { unique: true });
