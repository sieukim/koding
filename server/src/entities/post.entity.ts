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
import { User } from "./user.entity";
import { getCurrentTime } from "../common/utils/time.util";
import { PostReadCountIncreasedEvent } from "../posts/events/post-read-count-increased.event";
import { TagChangedEvent } from "../tags/events/tag-changed.event";
import { PostImageChangedEvent } from "../upload/event/post-image-changed.event";
import { Expose, Type } from "class-transformer";
import { PostModifiedEvent } from "../posts/events/post-modified.event";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";
import { v4 } from "uuid";
import { UUIDPrimaryColumn } from "./utils/uuid-column.decorator";
import { BoardTypeColumn } from "./utils/board-type-column.decorator";
import { NicknameColumn } from "./utils/nickname-column.decorator";
import { DelimiterArrayColumn } from "./utils/delimiter-array-column.decorator";
import { PostReport } from "./post-report.entity";
import { PostLike } from "./post-like.entity";
import { PostScrap } from "./post-scrap.entity";
import { TableName } from "./table-name.enum";
import { PostBoardType } from "./post-board.type";

@Index(["boardType", "createdAt"])
@Entity({
  name: TableName.Post,
})
export class Post extends AggregateRoot {
  @Expose()
  @IsString()
  @ApiProperty({
    description: "게시글 고유 아이디",
  })
  @UUIDPrimaryColumn()
  postId: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: "게시글 제목",
  })
  @Column("varchar", { length: 150 })
  title: string;

  @Expose()
  @IsEnum(PostBoardType)
  @ApiProperty({
    description: "게시판 타입",
    example: "common",
    enum: PostBoardType,
  })
  @BoardTypeColumn()
  boardType: PostBoardType;

  @Expose()
  @IsString()
  @ApiProperty({
    description: "게시글 작성자 닉네임. 탈퇴한 사용자인 경우 값 없음",
  })
  @NicknameColumn({ nullable: true })
  writerNickname: string | null = null;

  @Expose()
  @Type(() => User)
  @JoinColumn({ name: "writerNickname", referencedColumnName: "nickname" })
  @ManyToOne(() => User, {
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
    nullable: true,
  })
  writer?: User | null;

  @Expose()
  @Type(() => String)
  @ArrayMaxSize(5)
  @IsString({ each: true })
  @ApiProperty({
    description: "게시글 태그",
    type: [String],
  })
  @DelimiterArrayColumn()
  tags: string[];

  @Expose()
  @IsString()
  @ApiProperty({
    description: "마크다운 형식의 게시글 내용",
  })
  @Column("text")
  markdownContent: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: "html 형식의 게시글 내용",
  })
  @Column("text")
  htmlContent: string;

  @Expose()
  @IsDate()
  @ApiProperty({
    description: "게시글 생성 시간",
  })
  @Column("timestamp")
  createdAt: Date;

  // logstash 를 위해 필요
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @Expose()
  @Type(() => String)
  @ArrayMaxSize(15)
  @IsUrl(undefined, { each: true })
  @ApiProperty({
    description: "게시글에서 사용하는 이미지 url들",
    type: [String],
    format: "url",
    example: [],
  })
  @DelimiterArrayColumn()
  imageUrls: string[];

  @Expose()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: "게시글의 좋아요 수",
    type: Number,
  })
  @Column("int")
  likeCount = 0;

  @Expose()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: "게시글의 댓글 수",
    type: Number,
  })
  @Column("int")
  commentCount = 0;

  @Expose()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: "조회수",
  })
  @Column("int")
  readCount = 0;

  @Expose()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: "스크랩 수",
  })
  @Column("int")
  scrapCount = 0;

  @Expose()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: "신고 수",
  })
  @Column("int")
  reportCount = 0;

  @Expose()
  @OneToMany(() => PostReport, (postReport) => postReport.post)
  reports?: PostReport[];

  @OneToMany(() => PostLike, (postLike) => postLike.post)
  likes?: PostLike[];

  @OneToMany(() => PostScrap, (postScrap) => postScrap.post)
  scraps?: PostScrap[];

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
      this.postId = v4();
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
    if (tags) this.apply(new TagChangedEvent(this.boardType, this.tags, tags));
    if (imageUrls)
      this.apply(
        new PostImageChangedEvent(this.postId, this.imageUrls, imageUrls),
      );
    this.apply(
      new PostModifiedEvent({ postId: this.postId, boardType: this.boardType }),
    );
    this.verifyOwner(requestUser.nickname);
    this.title = title ?? this.title;
    this.tags = tags ?? this.tags;
    this.markdownContent = markdownContent ?? this.markdownContent;
    this.htmlContent = htmlContent ?? this.htmlContent;
    this.imageUrls = imageUrls ?? this.imageUrls;
  }

  verifyOwner(nickname: string) {
    if (!this.isOwner(nickname))
      throw new ForbiddenException("게시글에 대한 권한이 없습니다");
  }

  increaseReadCount() {
    this.readCount += 1;
    this.apply(
      new PostReadCountIncreasedEvent({
        postId: this.postId,
        boardType: this.boardType,
      }),
    );
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
