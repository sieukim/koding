import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsIn, IsNumber, IsString, IsUrl, Min } from "class-validator";
import { ForbiddenException } from "@nestjs/common";
import { AggregateRoot } from "@nestjs/cqrs";
import { User } from "./user.model";
import { currentTime } from "../common/utils/current-time.util";
import { IncreasePostReadCountEvent } from "../posts/events/increase-post-read-count.event";
import { Types } from "mongoose";
import { TagChangedEvent } from "../tags/events/tag-changed.event";
import { PostImageChangedEvent } from "../upload/event/post-image-changed.event";
import { Expose } from "class-transformer";

export class PostImage {
  s3Bucket: string;
  s3Key: string;
  @IsUrl(undefined, { each: true })
  @ApiProperty({
    description:
      "게시글에서 사용하는 이미지의 url들. 이미지 업로드 API의 반환값을 사용",
    type: [String],
  })
  url: string;
}

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
  @Expose()
  @IsString()
  @ApiProperty({
    description: "게시글 고유 아이디",
    type: String,
  })
  postId: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: "게시글 제목",
  })
  title: string;

  @Expose()
  @IsIn(postBoardTypes)
  @ApiProperty({
    description: "게시판 타입",
    example: "common",
    enum: postBoardTypes,
  })
  boardType: PostBoardType;

  @Expose()
  @IsString()
  @ApiProperty({
    description: "게시글 작성자 닉네임. 탈퇴한 회원인 경우 값 없음",
  })
  writerNickname?: string;

  @Expose()
  writer?: User;

  @Expose()
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
  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: "조회수",
  })
  readCount: number;

  @Expose()
  @IsDate()
  @ApiProperty({
    description: "게시글 생성 시간",
  })
  createdAt: Date;

  @Expose()
  @IsUrl(undefined, { each: true })
  @ApiProperty({
    description: "게시글에서 사용하는 이미지 url들",
    type: [String],
  })
  imageUrls: string[];

  constructor();
  constructor(param: {
    title: string;
    boardType: PostBoardType;
    writerNickname: string;
    tags: string[];
    markdownContent: string;
    imageUrls: string[];
  });
  constructor(param?: {
    title: string;
    boardType: PostBoardType;
    writerNickname: string;
    tags: string[];
    markdownContent: string;
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
      this.imageUrls = param.imageUrls ?? [];
      this.readCount = 0;
      this.createdAt = currentTime();
    }
  }

  modifyPost(
    requestUser: User,
    {
      title,
      tags,
      markdownContent,
      imageUrls,
    }: {
      title?: string;
      tags?: string[];
      markdownContent?: string;
      imageUrls?: string[];
    },
  ) {
    this.apply(new TagChangedEvent(this.boardType, this.tags, tags));
    this.apply(
      new PostImageChangedEvent(this.postId, this.imageUrls, imageUrls),
    );
    this.verifyOwner(requestUser);
    this.title = title ?? this.title;
    this.tags = tags ?? this.tags;
    this.markdownContent = markdownContent ?? this.markdownContent;
    this.imageUrls = imageUrls ?? this.imageUrls;
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
