import { User } from "./user.model";
import { getCurrentTime } from "../common/utils/time.util";
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Post, PostBoardType } from "./post.model";
import { Types } from "mongoose";
import { BadRequestException, ForbiddenException } from "@nestjs/common";
import { ModifyCommentRequestDto } from "../comments/dto/modify-comment-request.dto";
import { Expose, Type } from "class-transformer";
import { UserDocumentToUserTransformDecorator } from "../common/decorator/user-document-to-user-transform.decorator";
import { PostDocumentToPostTransform } from "../common/decorator/post-document-to-post.transform";

export class Comment {
  @Expose()
  @IsString()
  @ApiProperty({
    description: "댓글의 고유 아이디",
    type: String,
  })
  commentId: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: "댓글의 부모 게시글 아이디",
    type: String,
  })
  postId: string;

  @Expose()
  @IsEnum(PostBoardType)
  @ApiProperty({
    description: "댓글의 부모 게시글의 게시판",
    enum: PostBoardType,
  })
  boardType: PostBoardType;

  @Type(() => Post)
  @PostDocumentToPostTransform()
  @Expose()
  post?: Post;

  @Expose()
  @IsOptional()
  @ApiProperty({
    description: "댓글 글쓴이 닉네임. 탈퇴한 사용자인 경우 값 없음",
    type: String,
  })
  writerNickname?: string;

  @Type(() => User)
  @UserDocumentToUserTransformDecorator()
  @Expose()
  writer?: User;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: "댓글 내용",
  })
  content: string;

  @Expose()
  @IsDate()
  @ApiProperty({
    description: "댓글 생성 시간",
  })
  createdAt: Date;

  @Expose()
  @IsNumber()
  @ApiProperty({
    description: "댓글 좋아요 수",
  })
  likeCount: number;

  @Expose()
  @ApiProperty({
    description: "댓글에서 멘션하는 유저들의 닉네임",
  })
  mentionedNicknames: string[];

  @UserDocumentToUserTransformDecorator()
  @Type(() => User)
  @Expose()
  mentionedUsers?: User[];

  constructor();
  constructor(param: {
    post: Post;
    writerNickname: string;
    content: string;
    mentionedNicknames: string[];
  });
  constructor(param?: {
    post: Post;
    writerNickname: string;
    content: string;
    mentionedNicknames: string[];
  }) {
    if (param) {
      this.commentId = new Types.ObjectId().toString();
      this.postId = param.post.postId;
      this.boardType = param.post.boardType;
      this.writerNickname = param.writerNickname;
      this.content = param.content;
      this.likeCount = 0;
      this.mentionedNicknames = param.mentionedNicknames ?? [];
      this.createdAt = getCurrentTime();
    }
  }

  verifyOwner(user: User) {
    if (!this.isOwner(user))
      throw new ForbiddenException("게시글에 대한 권한이 없습니다");
  }

  modifyComment(
    requestUser: User,
    { content, mentionedNicknames }: ModifyCommentRequestDto,
  ) {
    this.verifyOwner(requestUser);
    this.content = content ?? this.content;
    this.mentionedNicknames = mentionedNicknames ?? this.mentionedNicknames;
  }

  verifyOwnerPost(post: Post) {
    if (!this.isOwnerPost(post))
      throw new BadRequestException("댓글에 대한 잘못된 게시글입니다");
  }

  private isOwner(userNickname: string);

  private isOwner(user: User);

  private isOwner(userOrNickname: User | string) {
    if (userOrNickname instanceof User)
      return this.writerNickname === userOrNickname.nickname;
    return this.writerNickname === userOrNickname;
  }

  private isOwnerPost(postId: string);

  private isOwnerPost(post: Post);

  private isOwnerPost(postOrId: Post | string) {
    if (postOrId instanceof Post) return this.postId === postOrId.postId;
    return this.postId === postOrId;
  }
}
