import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsString } from "class-validator";
import { ForbiddenException } from "@nestjs/common";
import { AggregateRoot } from "@nestjs/cqrs";
import { PartialUser, User } from "./user.model";
import { currentTime } from "../common/utils/current-time.util";
import { IncreasePostReadCountEvent } from "../posts/events/increase-post-read-count.event";
import { Types } from "mongoose";

export const postBoardTypes = [
  "common",
  "question",
  "career",
  "recruit",
  "study-group",
  "column",
] as const;
export type PostBoardType = typeof postBoardTypes[number];

export class Post extends AggregateRoot {
  postId: string;
  @ApiProperty({
    description: "게시글 제목",
  })
  @IsString()
  title: string;
  @IsIn(postBoardTypes)
  @ApiProperty({
    description: "게시판 타입",
    example: "common",
    enum: postBoardTypes,
  })
  boardType: PostBoardType;
  writer: PartialUser | User;
  @IsString({ each: true })
  @ApiProperty({
    description: "게시글 태그",
    type: [String],
  })
  tags: string[];
  @IsString()
  @ApiProperty({
    description: "마크다운 형식의 게시글 내용",
  })
  markdownContent: string;
  @ApiProperty({
    description: "조회수",
  })
  readCount: number;
  @ApiProperty({
    description: "게시글 생성 시간",
  })
  createdAt: Date;

  constructor(param: {
    title: string;
    boardType: PostBoardType;
    writer: PartialUser | User;
    tags: string[];
    markdownContent: string;
  });

  constructor(param: {
    postId: string;
    title: string;
    boardType: PostBoardType;
    writer: PartialUser | User;
    tags: string[];
    markdownContent: string;
    readCount: number;
    createdAt: Date;
  });

  constructor(param: {
    postId?: string;
    title: string;
    boardType: PostBoardType;
    writer: PartialUser | User;
    tags: string[];
    markdownContent: string;
    readCount?: number;
    createdAt?: Date;
  }) {
    super();
    this.postId = param.postId ?? new Types.ObjectId().toString();
    this.title = param.title;
    this.boardType = param.boardType;
    this.writer = param.writer;
    this.tags = param.tags ?? [];
    this.markdownContent = param.markdownContent;
    this.readCount = param.readCount ?? 0;
    this.createdAt = param.createdAt ?? currentTime();
  }

  modifyPost(
    requestUser: User,
    {
      title,
      tags,
      markdownContent,
    }: { title?: string; markdownContent?: string; tags?: string[] },
  ) {
    this.verifyOwner(requestUser);
    this.title = title ?? this.title;
    this.tags = tags ?? this.tags;
    this.markdownContent = markdownContent ?? this.markdownContent;
  }

  verifyOwner(user: User) {
    if (!this.isOwner(user))
      throw new ForbiddenException("게시글에 대한 권한이 없습니다");
  }

  increaseReadCount() {
    this.apply(
      new IncreasePostReadCountEvent({
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
      return this.writer.nickname === userOrNickname.nickname;
    else return this.writer.nickname === userOrNickname;
  }
}

export type PostIdentifier = {
  boardType: PostBoardType;
  postId: string;
};
