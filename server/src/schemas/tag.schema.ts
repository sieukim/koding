import { Document, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { PostBoardType } from "../models/post.model";

@Schema({ _id: true, id: false, autoIndex: true, versionKey: false })
export class TagDocument extends Document {
  _id: Types.ObjectId;

  @Prop({ type: String })
  boardType: PostBoardType;

  @Prop({ type: String })
  tag: string;

  @Prop({ type: Number, default: 0, min: 0 })
  refCount = 0;

  @Prop({ type: Boolean, default: false })
  certified = false;
}

export const TagSchema = SchemaFactory.createForClass(TagDocument);
TagSchema.index({ tag: 1, boardType: 1, refCount: 1 }, { unique: true });
TagSchema.index({ certified: 1, boardType: 1 });
