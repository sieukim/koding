import { Document, Model, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UserDocument } from "./user.schema";
import { currentTime } from "../common/utils/current-time.util";
import { Post, PostBoardType } from "../models/post.model";
import { PartialUser } from "../models/user.model";

@Schema({
  id: false,
  _id: true,
  autoIndex: true,
  versionKey: false,
  timestamps: {
    createdAt: true,
    updatedAt: false,
    currentTime: currentTime,
  },
})
export class PostDocument extends Document {
  // @Prop({ type: Types.ObjectId })
  // _id: Types.ObjectId;

  postId: Types.ObjectId;

  @Prop()
  title: string;

  @Prop({ type: String, default: "common" })
  boardType: PostBoardType;

  @Prop({
    type: String,
    required: false,
  })
  writerNickname?: string;

  writer?: UserDocument;

  @Prop({ type: [String] })
  tags: string[];

  @Prop()
  markdownContent: string;

  @Prop({ type: Number, default: 0, min: 0 })
  readCount: number;

  createdAt: Date;

  @Prop({ type: [String] })
  imageUrls: string[];

  static toModel(postDocument: PostDocument): Post {
    const {
      postId,
      boardType,
      writerNickname,
      writer,
      readCount,
      tags,
      markdownContent,
      createdAt,
      title,
      imageUrls,
    } = postDocument;
    return new Post({
      title,
      postId: postId.toString(),
      boardType,
      writer: writer
        ? UserDocument.toModel(writer)
        : new PartialUser({ nickname: writerNickname }),
      tags,
      markdownContent,
      readCount,
      createdAt,
      imageUrls,
    });
  }

  static fromModel(post: Post, model: Model<PostDocument>): PostDocument {
    const {
      postId,
      boardType,
      writer,
      tags,
      markdownContent,
      createdAt,
      readCount,
      title,
      imageUrls,
    } = post;
    return new model({
      postId: new Types.ObjectId(postId),
      boardType,
      writerNickname: writer.nickname,
      tags,
      markdownContent,
      createdAt,
      readCount,
      title,
      imageUrls,
    });
  }
}

export const PostSchema = SchemaFactory.createForClass(PostDocument);
PostSchema.index({ boardType: 1, _id: 1 });
PostSchema.virtual("writer", {
  ref: UserDocument.name,
  localField: "writerNickname",
  foreignField: "nickname",
  justOne: true,
});
PostSchema.virtual("postId")
  .get(function () {
    return this._id;
  })
  .set(function (value) {
    if (value instanceof Types.ObjectId) this._id = value;
    else this._id = new Types.ObjectId(value);
  });
PostSchema.set("toObject", { virtuals: true });
PostSchema.set("toJSON", { virtuals: true });
