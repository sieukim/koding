import { Document, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { PostBoardType, PostBoardTypes } from "../models/post.model";
import { getCurrentDate } from "../common/utils/time.util";
import { PostDocument } from "./post.schema";

@Schema({
  _id: true,
  id: false,
  autoIndex: true,
  versionKey: false,
})
export class PostDailyRankingDocument extends Document {
  @Prop({ type: Types.ObjectId })
  postId: Types.ObjectId;

  post?: PostDocument;

  @Prop({ type: String, enum: PostBoardTypes })
  boardType: PostBoardType;

  @Prop({ type: Number, default: 0 })
  popularity = 0;

  @Prop({ type: Number, default: 0 })
  readCount = 0;

  @Prop({ type: Number, default: 0 })
  likeCount = 0;

  @Prop({ type: Number, default: 0 })
  commentCount = 0;

  @Prop({ type: Number, default: 0 })
  scrapCount = 0;

  // 집계 날짜. 분,초 정보 없이 연,월,일 정보만 저장
  @Prop({ type: Date, default: getCurrentDate })
  aggregateDate: Date;
}

export const PostDailyRankingSchema = SchemaFactory.createForClass(
  PostDailyRankingDocument,
);
PostDailyRankingSchema.index(
  { postId: 1, aggregateDate: 1, boardType: 1 },
  { unique: true },
); // 필드 값 업데이트 쿼리를 위해
PostDailyRankingSchema.index({
  aggregateDate: 1,
  boardType: 1,
  popularity: 1,
  postId: 1,
});
PostDailyRankingSchema.virtual("post", {
  foreignField: "_id",
  localField: "postId",
  ref: PostDocument.name,
  justOne: true,
});
