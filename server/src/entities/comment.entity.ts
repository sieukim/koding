import { User } from "./user.entity";
import { getCurrentTime } from "../common/utils/time.util";
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Post, PostIdentifier } from "./post.entity";
import { BadRequestException, ForbiddenException } from "@nestjs/common";
import { ModifyCommentRequestDto } from "../comments/dto/modify-comment-request.dto";
import { Expose, Type } from "class-transformer";
import { UUIDColumn, UUIDPrimaryColumn } from "./utils/uuid-column.decorator";
import { v4 } from "uuid";
import { Column, Entity, Index, ManyToOne, OneToMany } from "typeorm";
import { NicknameColumn } from "./utils/nickname-column.decorator";
import { DelimiterArrayColumn } from "./utils/delimiter-array-column.decorator";
import { CommentLike } from "./comment-like.entity";
import { TableName } from "./table-name.enum";
import { PostBoardType } from "./post-board.type";

@Index(["postId", "createdAt"])
@Index(["writerNickname", "createdAt", "commentId"])
@Index(["createdAt", "commentId"])
@Entity({ name: TableName.Comment })
export class Comment {
  @Expose()
  @IsString()
  @ApiProperty({
    description: "댓글의 고유 아이디",
    type: String,
  })
  @UUIDPrimaryColumn()
  commentId: string = v4();

  @Expose()
  @IsString()
  @ApiProperty({
    description: "댓글의 부모 게시글 아이디",
    type: String,
  })
  @UUIDColumn()
  postId: string;

  @Expose()
  @IsEnum(PostBoardType)
  @ApiProperty({
    description: "댓글의 부모 게시글의 게시판",
    enum: PostBoardType,
  })
  boardType: PostBoardType;

  @Expose()
  @Type(() => Post)
  @ManyToOne(() => Post, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  post?: Post;

  @Expose()
  @IsOptional()
  @ApiProperty({
    description: "댓글 글쓴이 닉네임. 탈퇴한 사용자인 경우 값 없음",
    type: String,
  })
  @NicknameColumn({ nullable: true })
  writerNickname: string | null;

  @Expose()
  @Type(() => User)
  @ManyToOne(() => User, {
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
    nullable: true,
  })
  writer?: User | null;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  @ApiProperty({
    description: "댓글 내용",
  })
  @Column("varchar", { length: 200 })
  content: string;

  @Expose()
  @IsDate()
  @ApiProperty({
    description: "댓글 생성 시간",
  })
  @Column("timestamp")
  createdAt: Date;

  @Expose()
  @IsNumber()
  @ApiProperty({
    description: "댓글 좋아요 수",
  })
  @Column("int")
  likeCount: number;

  @Expose()
  @ApiProperty({
    description: "댓글에서 멘션하는 유저들의 닉네임",
  })
  @DelimiterArrayColumn()
  mentionedNicknames: string[] = [];

  @OneToMany(() => CommentLike, (commentLike) => commentLike.comment)
  likes?: CommentLike[];

  constructor(param?: {
    postIdentifier: PostIdentifier;
    writerNickname: string;
    content: string;
    mentionedNicknames: string[];
  }) {
    if (param) {
      this.commentId = v4();
      this.postId = param.postIdentifier.postId;
      this.boardType = param.postIdentifier.boardType;
      this.writerNickname = param.writerNickname;
      this.content = param.content;
      this.likeCount = 0;
      this.mentionedNicknames = param.mentionedNicknames ?? [];
      this.createdAt = getCurrentTime();
    }
  }

  verifyOwner(nickname: string) {
    if (!this.isOwner(nickname))
      throw new ForbiddenException("게시글에 대한 권한이 없습니다");
  }

  modifyComment(
    requestUserNickname: string,
    { content, mentionedNicknames }: ModifyCommentRequestDto,
  ) {
    this.verifyOwner(requestUserNickname);
    this.content = content ?? this.content;
    this.mentionedNicknames = mentionedNicknames ?? this.mentionedNicknames;
  }

  verifyOwnerPost(postIdentifier: PostIdentifier) {
    if (!this.isOwnerPost(postIdentifier))
      throw new BadRequestException("댓글에 대한 잘못된 게시글입니다");
  }

  private isOwner(userNickname: string);

  private isOwner(user: User);

  private isOwner(userOrNickname: User | string) {
    if (userOrNickname instanceof User)
      return this.writerNickname === userOrNickname.nickname;
    return this.writerNickname === userOrNickname;
  }

  private isOwnerPost({ postId, boardType }: PostIdentifier) {
    return this.postId === postId && this.boardType === boardType;
  }
}
