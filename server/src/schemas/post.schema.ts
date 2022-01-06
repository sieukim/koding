import { Document, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "./user.schema";
import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNotEmpty, IsString } from "class-validator";
import { NotFoundException } from "@nestjs/common";
import { schemaLoadClass } from "../common/utils/schema-load-class.util";
import { currentTime } from "../common/utils/current-time.util";

@Schema({ versionKey: false, timestamps: { createdAt: true, updatedAt: false, currentTime: currentTime } })
export class Comment extends Types.Subdocument {
  _id: Types.ObjectId;

  @Prop({
    type: {
      _id: { type: Types.ObjectId, ref: User.name, index: true },
      nickname: String
    }
  })
  writer: {
    _id: Types.ObjectId | User,
    nickname: string
  };

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: "댓글 내용"
  })
  @Prop()
  content: string;

  @ApiProperty({
    description: "댓글 생성 시간"
  })
  createdAt: Date;

  @Prop({
    type: [{
      type: {
        _id: { type: Types.ObjectId, ref: User.name },
        nickname: String
      }
    }]
  })
  mentionedUsers: {
    _id: Types.ObjectId | User,
    nickname: string
  }[];

  isOwner(user: User) {
    if (!user)
      return false;
    if (this.writer._id instanceof User)
      return this.writer._id._id.toString() === user._id.toString();
    else return this.writer._id.toString() === user._id.toString();
  }

  modifyComment({ content, mentionedUsers }: { content?: string, mentionedUsers?: User[] }) {
    this.content = content ?? this.content;
    if (mentionedUsers)
      this.mentionedUsers = mentionedUsers.map(({ _id, nickname }) => ({ _id, nickname }));

  }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
schemaLoadClass(CommentSchema, Comment);

export type PostDocument = Post & Document;
export const postBoardTypes = ["common", "question", "career", "recruit", "study-group", "column"] as const;
export type PostBoardType = typeof postBoardTypes[number];
@Schema({
  id: false, _id: true, autoIndex: true, versionKey: false, timestamps: {
    createdAt: true, updatedAt: false,
    currentTime: currentTime
  }
})
export class Post extends Document {
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

  @Prop({
    type: {
      _id: { type: Types.ObjectId, ref: User.name, index: true },
      nickname: String
    }
  })
  writer: {
    _id: User | Types.ObjectId,
    nickname: string
  };

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
  comments: Types.DocumentArray<Comment>;

  @ApiProperty({
    description: "게시글 생성 시간"
  })
  createdAt: Date;

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
    if (this.writer._id instanceof User)
      return this.writer._id._id.toString() === user._id.toString();
    else
      return this.writer._id.toString() === user._id.toString();
  }

  addComment(writer: User, { content, mentionedUsers = [] }: { content: string, mentionedUsers: User[] }) {
    const comment = this.comments.create({
      writer: { _id: writer._id, nickname: writer.nickname },
      content,
      mentionedUsers: mentionedUsers.map(({ _id, nickname }) => ({ _id, nickname }))
    });
    this.comments.push(comment);
  }

  getComment(commentId: string) {
    const comment = this.comments.id(commentId);
    if (!comment)
      throw new NotFoundException("잘못된 댓글 아이디입니다");
    return comment;
  }

  deleteComment(commentId: string) {
    const comment = this.getComment(commentId);
    this.comments.pull(comment);
  }

}

export type PostIdentifier = {
  boardType: PostBoardType,
  postId: string
}
export const PostSchema = SchemaFactory.createForClass(Post);
schemaLoadClass(PostSchema, Post);
PostSchema.index({ _id: 1, boardType: 1 });
