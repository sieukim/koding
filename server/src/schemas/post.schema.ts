import { Document, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "./user.schema";
import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsString } from "class-validator";

@Schema({ versionKey: false })
export class Comment {
  @Prop({ type: Types.ObjectId, ref: User.name, index: true })
  writer: User | Types.ObjectId;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

export type PostDocument = Post & Document;
export const postBoardTypes = ["common", "question", "career", "recruit", "study-group", "column"] as const;
export type PostBoardType = typeof postBoardTypes[number];

@Schema({ id: false, _id: true, autoIndex: true, versionKey: false })
export class Post {
  _id: Types.ObjectId;

  @ApiProperty({
    description: "게시글 제목"
  })
  @IsString()
  @Prop()
  title: string;

  @IsIn(postBoardTypes)
  @ApiProperty({
    description: "게시판 타입",
    example: "common",
    enum: postBoardTypes
  })
  @Prop({ type: String, index: true, default: "common" })
  boardType: PostBoardType;

  @Prop({ type: Types.ObjectId, ref: User.name, index: true })
  writer: User | Types.ObjectId;

  @IsString({ each: true })
  @ApiProperty({
    description: "게시글 태그",
    type: [String]
  })
  @Prop({ type: [String], index: true })
  tags: string[];

  @IsString()
  @ApiProperty({
    description: "마크다운 형식의 게시글 내용"
  })
  @Prop()
  markdownContent: string;

  @ApiProperty({
    description: "조회수"
  })
  @Prop({ type: Number, default: 0, min: 0 })
  readCount: number;

  @Prop({ type: [CommentSchema] })
  comments: Comment[];

  modifyPost({
               title,
               tags,
               markdownContent
             }: { title?: string, markdownContent?: string, tags?: string[] }) {
    this.title = title ?? this.title;
    this.tags = tags ?? this.tags;
    this.markdownContent = markdownContent ?? this.markdownContent;
  }

  isOwner(user: User) {
    if (this.writer instanceof User)
      return this.writer._id === user._id;
    else
      return this.writer.toString() === user._id.toString();
  }

}

export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.loadClass(Post);
PostSchema.index({ _id: 1, boardType: 1 });
