import { Document, Model, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UserDocument } from "./user.schema";
import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsString } from "class-validator";
import { currentTime } from "../common/utils/current-time.util";
import { Post } from "../models/post.model";
import { PartialUser } from "../models/user.model";

export const postBoardTypes = [
  "common",
  "question",
  "career",
  "recruit",
  "study-group",
  "column",
] as const;
export type PostBoardType = typeof postBoardTypes[number];

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

  @ApiProperty({
    description: "게시글 제목",
  })
  @IsString()
  @Prop()
  title: string;

  @IsIn(postBoardTypes)
  @ApiProperty({
    description: "게시판 타입",
    example: "common",
    enum: postBoardTypes,
  })
  @Prop({ type: String, default: "common" })
  boardType: PostBoardType;

  @Prop({
    type: String,
  })
  writerNickname: string;

  writer?: UserDocument;

  @IsString({ each: true })
  @ApiProperty({
    description: "게시글 태그",
    type: [String],
  })
  @Prop({ type: [String] })
  tags: string[];

  @IsString()
  @ApiProperty({
    description: "마크다운 형식의 게시글 내용",
  })
  @Prop()
  markdownContent: string;

  @ApiProperty({
    description: "조회수",
  })
  @Prop({ type: Number, default: 0, min: 0 })
  readCount: number;

  @ApiProperty({
    description: "게시글 생성 시간",
  })
  createdAt: Date;

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
