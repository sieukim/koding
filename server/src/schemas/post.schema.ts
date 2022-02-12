import { Document, Model, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UserDocument } from "./user.schema";
import { getCurrentTime } from "../common/utils/time.util";
import { Post, PostBoardType, PostBoardTypes } from "../models/post.model";
import { Expose, plainToClass, Type } from "class-transformer";
import { PostReportDocument } from "./post-report.schema";

@Schema({
  id: false,
  _id: true,
  autoIndex: true,
  versionKey: false,
  timestamps: {
    createdAt: true,
    updatedAt: false,
    currentTime: getCurrentTime,
  },
})
export class PostDocument extends Document {
  // @Prop({ type: Types.ObjectId })
  // _id: Types.ObjectId;

  @Expose()
  postId: string;

  @Expose()
  @Prop()
  title: string;

  @Expose()
  @Prop({ type: String, default: "common", enum: PostBoardTypes })
  boardType: PostBoardType;

  @Expose()
  @Prop({
    type: String,
    required: false,
  })
  writerNickname?: string;

  @Expose()
  @Type(() => UserDocument)
  writer?: UserDocument;

  @Expose()
  @Type(() => String)
  @Prop({ type: [String] })
  tags: string[];

  @Expose()
  @Prop()
  markdownContent: string;

  @Expose()
  @Prop()
  htmlContent: string;

  @Expose()
  createdAt: Date;

  @Expose()
  @Type(() => String)
  @Prop({ type: [String] })
  imageUrls: string[];

  @Expose()
  @Prop({ type: Number, default: 0 })
  readCount: number;

  @Expose()
  @Prop({ type: Number, default: 0 })
  likeCount: number;

  @Expose()
  @Prop({ type: Number, default: 0 })
  commentCount: number;

  @Expose()
  @Prop({ type: Number, default: 0 })
  scrapCount: number;

  @Expose()
  @Prop({ type: Number, default: 0 })
  reportCount: number;

  // 신고 목록
  @Expose()
  reports?: PostReportDocument[];

  static toModel(postDocument: PostDocument): Post {
    return plainToClass(Post, postDocument, {
      excludeExtraneousValues: true,
    });
  }

  static fromModel(post: Post, model: Model<PostDocument>): PostDocument {
    return new model(post);
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
PostSchema.virtual("reports", {
  ref: PostReportDocument.name,
  localField: "_id",
  foreignField: "postId",
  justOne: false,
});
PostSchema.virtual("postId")
  .get(function () {
    return this._id.toString();
  })
  .set(function (value) {
    if (value instanceof Types.ObjectId) this._id = value;
    else this._id = new Types.ObjectId(value);
  });
PostSchema.set("toObject", { virtuals: true });
PostSchema.set("toJSON", { virtuals: true });
