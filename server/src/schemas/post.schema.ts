import { Document, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "./user.schema";

export type PostDocument = Post & Document;

@Schema({ id: false, _id: true, autoIndex: true, versionKey: false })
export class Post {
  @Prop({ type: Types.ObjectId, ref: User.name, index: true })
  writer: User;

  @Prop({ type: [String], index: true })
  tags: string[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.loadClass(Post);
