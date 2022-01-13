import { PartialUser, User } from "./user.model";
import { currentTime } from "../common/utils/current-time.util";
import { IsDate, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Post } from "./post.model";
import { Types } from "mongoose";
import { BadRequestException, ForbiddenException } from "@nestjs/common";
import { ModifyCommentRequestDto } from "../comments/dto/modify-comment-request.dto";

export class Comment {
  @IsString()
  @ApiProperty({
    description: "댓글의 고유 아이디",
    type: String,
  })
  commentId: string;
  @IsString()
  @ApiProperty({
    description: "댓글의 부모 게시글 아이디",
    type: String,
  })
  postId: string;

  post?: Post;

  @ApiProperty({
    description: "댓글 글쓴이 닉네임",
    type: String,
  })
  writerNickname: string;
  writer?: User;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: "댓글 내용",
  })
  content: string;

  @IsDate()
  @ApiProperty({
    description: "댓글 생성 시간",
  })
  createdAt: Date;
  mentionedUsers: (PartialUser | User)[];

  constructor(param: {
    postId: string;
    writerNickname: string;
    writer?: User;
    content: string;
    mentionedUsers: (PartialUser | User)[];
  });

  constructor(param: {
    postId: string;
    post?: Post;
    commentId: string;
    writerNickname: string;
    writer?: User;
    content: string;
    mentionedUsers: (PartialUser | User)[];
    createdAt: Date;
  });

  constructor(param: {
    postId: string;
    post?: Post;
    commentId?: string;
    writerNickname: string;
    writer?: User;
    content: string;
    mentionedUsers: (PartialUser | User)[];
    createdAt?: Date;
  }) {
    this.commentId = param.commentId ?? new Types.ObjectId().toString();
    this.postId = param.postId;
    if (param.post) {
      this.post = param.post;
    }
    this.writerNickname = param.writerNickname;
    if (param.writer) {
      this.writer = param.writer;
      this.writerNickname = param.writer.nickname;
    }
    this.content = param.content;
    this.mentionedUsers = param.mentionedUsers ?? [];
    this.createdAt = param.createdAt ?? currentTime();
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
    if (mentionedNicknames)
      this.mentionedUsers = mentionedNicknames.map(
        (nickname) => new PartialUser({ nickname }),
      );
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
