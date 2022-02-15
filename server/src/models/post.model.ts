import { ApiProperty } from "@nestjs/swagger";
import {
  ArrayMaxSize,
  IsDate,
  IsEnum,
  IsNumber,
  IsString,
  IsUrl,
  Min,
} from "class-validator";
import { ForbiddenException } from "@nestjs/common";
import { AggregateRoot } from "@nestjs/cqrs";
import { User } from "./user.model";
import { getCurrentTime } from "../common/utils/time.util";
import { PostReadCountIncreasedEvent } from "../posts/events/post-read-count-increased.event";
import { Types } from "mongoose";
import { TagChangedEvent } from "../tags/events/tag-changed.event";
import { PostImageChangedEvent } from "../upload/event/post-image-changed.event";
import { Expose, Type } from "class-transformer";
import { PostModifiedEvent } from "../posts/events/post-modified.event";
import { UserDocumentToUserTransformDecorator } from "../common/decorator/user-document-to-user-transform.decorator";

export enum PostBoardType {
  Common = "common",
  Question = "question",
  Career = "career",
  Recruit = "recruit",
  StudyGroup = "study-group",
  Column = "column",
}

export const PostBoardTypes = Object.values(PostBoardType);

export class Post extends AggregateRoot {
  @Expose()
  @IsString()
  @ApiProperty({
    description: "게시글 고유 아이디",
  })
  postId: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: "게시글 제목",
  })
  title: string;

  @Expose()
  @IsEnum(PostBoardType)
  @ApiProperty({
    description: "게시판 타입",
    example: "common",
    enum: PostBoardType,
  })
  boardType: PostBoardType;

  @Expose()
  @IsString()
  @ApiProperty({
    description: "게시글 작성자 닉네임. 탈퇴한 사용자인 경우 값 없음",
  })
  writerNickname?: string;

  @Type(() => User)
  @Expose()
  @UserDocumentToUserTransformDecorator()
  writer?: User;

  @Expose()
  @ArrayMaxSize(5)
  @IsString({ each: true })
  @ApiProperty({
    description: "게시글 태그",
    type: [String],
  })
  tags: string[];

  @Expose()
  @IsString()
  @ApiProperty({
    description: "마크다운 형식의 게시글 내용",
  })
  markdownContent: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: "html 형식의 게시글 내용",
  })
  htmlContent: string;

  @Expose()
  @IsDate()
  @ApiProperty({
    description: "게시글 생성 시간",
  })
  createdAt: Date;

  @Expose()
  @ArrayMaxSize(15)
  @IsUrl(undefined, { each: true })
  @ApiProperty({
    description: "게시글에서 사용하는 이미지 url들",
    type: [String],
    format: "url",
    example: [],
  })
  imageUrls: string[];

  @Expose()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: "게시글의 좋아요 수",
    type: Number,
  })
  likeCount: number;

  @Expose()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: "게시글의 댓글 수",
    type: Number,
  })
  commentCount: number;

  @Expose()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: "조회수",
  })
  readCount: number;

  @Expose()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: "스크랩 수",
  })
  scrapCount: number;

  @Expose()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: "신고 수",
  })
  reportCount: number;

  constructor();
  constructor(param: {
    title: string;
    boardType: PostBoardType;
    writerNickname: string;
    tags: string[];
    markdownContent: string;
    htmlContent: string;
    imageUrls: string[];
  });
  constructor(param?: {
    title: string;
    boardType: PostBoardType;
    writerNickname: string;
    tags: string[];
    markdownContent: string;
    htmlContent: string;
    imageUrls: string[];
  }) {
    super();
    if (param) {
      this.postId = new Types.ObjectId().toString();
      this.title = param.title;
      this.boardType = param.boardType;
      this.writerNickname = param.writerNickname;
      this.tags = param.tags ?? [];
      this.markdownContent = param.markdownContent;
      this.htmlContent = param.htmlContent;
      this.imageUrls = param.imageUrls ?? [];
      this.readCount = 0;
      this.likeCount = 0;
      this.commentCount = 0;
      this.reportCount = 0;
      this.createdAt = getCurrentTime();
    }
  }

  modifyPost(
    requestUser: User,
    {
      title,
      tags,
      markdownContent,
      htmlContent,
      imageUrls,
    }: {
      title?: string;
      tags?: string[];
      markdownContent?: string;
      htmlContent?: string;
      imageUrls?: string[];
    },
  ) {
    this.apply(new TagChangedEvent(this.boardType, this.tags, tags));
    this.apply(
      new PostImageChangedEvent(this.postId, this.imageUrls, imageUrls),
    );
    this.apply(
      new PostModifiedEvent({ postId: this.postId, boardType: this.boardType }),
    );
    this.verifyOwner(requestUser);
    this.title = title ?? this.title;
    this.tags = tags ?? this.tags;
    this.markdownContent = markdownContent ?? this.markdownContent;
    this.htmlContent = htmlContent ?? this.htmlContent;
    this.imageUrls = imageUrls ?? this.imageUrls;
  }

  verifyOwner(user: User) {
    if (!this.isOwner(user))
      throw new ForbiddenException("게시글에 대한 권한이 없습니다");
  }

  increaseReadCount() {
    this.apply(
      new PostReadCountIncreasedEvent({
        postId: this.postId,
        boardType: this.boardType,
      }),
    );
    this.readCount += 1;
  }

  private isOwner(nickname: string);

  private isOwner(user: User);

  private isOwner(userOrNickname: User | string) {
    if (userOrNickname instanceof User)
      return this.writerNickname === userOrNickname.nickname;
    else return this.writerNickname === userOrNickname;
  }
}

export type PostIdentifier = {
  boardType: PostBoardType;
  postId: string;
};
