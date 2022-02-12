import { Document, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { getCurrentTime } from "../common/utils/time.util";
import { PostBoardType, PostBoardTypes } from "../models/post.model";
import { UserDocument } from "./user.schema";
import { Expose } from "class-transformer";

@Schema({
  _id: true,
  id: false,
  autoIndex: true,
  versionKey: false,
  timestamps: {
    createdAt: true,
    updatedAt: false,
    currentTime: getCurrentTime,
  },
})
export class PostReportDocument extends Document {
  _id: Types.ObjectId;

  // postReportId: Types.ObjectId;

  @Expose()
  @Prop({ type: Types.ObjectId })
  postId: Types.ObjectId;

  @Expose()
  @Prop({ type: String, enum: PostBoardTypes })
  boardType: PostBoardType;

  // @Expose()
  // @Prop()
  // post?: PostDocument;

  @Expose()
  @Prop({ type: String })
  nickname: string;

  @Expose()
  user?: UserDocument;

  @Expose()
  @Prop({ type: String })
  reportReason: string;

  @Expose()
  createdAt: Date;
}

export const PostReportSchema =
  SchemaFactory.createForClass(PostReportDocument);
PostReportSchema.index(
  // 게시글 신고,  시
  {
    postId: 1,
    nickname: 1,
    boardType: 1,
  },
  { unique: true },
);
PostReportSchema.index({
  // 사용자가 좋아요한 게시글들 조회 시
  nickname: 1,
  _id: 1,
});
// PostReportSchema.virtual("post", {
//   ref: PostDocument.name,
//   localField: "postId",
//   foreignField: "_id",
//   justOne: true,
// });
PostReportSchema.virtual("user", {
  ref: UserDocument.name,
  localField: "nickname",
  foreignField: "nickname",
  justOne: true,
});
// PostReportSchema.virtual("postReportId")
//   .get(function () {
//     return this._id.toString();
//   })
//   .set(function (value) {
//     if (value instanceof Types.ObjectId) this._id = value;
//     else this._id = new Types.ObjectId(value);
//   });
PostReportSchema.set("toObject", { virtuals: true });
PostReportSchema.set("toJSON", { virtuals: true });
