import { IsBoolean, IsDate, IsEnum, IsIn, IsString } from "class-validator";
import { PostBoardType } from "./post.model";
import {
  ApiExtraModels,
  ApiProperty,
  getSchemaPath,
  refs,
} from "@nestjs/swagger";
import { Types } from "mongoose";
import { getCurrentUTCTime } from "../common/utils/time.util";
import { Expose, Type } from "class-transformer";

export type NotificationType = typeof NotificationTypes[number];
export const NotificationTypes = [
  "comment",
  "follow",
  "mention",
  "commentDeleted",
  "postDeleted",
] as const;

export abstract class NotificationData {
  @Expose()
  @IsIn(NotificationTypes)
  @ApiProperty({
    description: "알림 타입",
    enum: NotificationTypes,
  })
  type: NotificationType;

  protected constructor(type: NotificationType) {
    this.type = type;
  }
}

export class CommentNotificationData extends NotificationData {
  @Expose()
  @IsEnum(PostBoardType)
  @ApiProperty({
    description: "댓글이 달린 게시글의 게시판",
    enum: PostBoardType,
  })
  boardType: PostBoardType;
  @Expose()
  @IsString()
  @ApiProperty({
    description: "댓글이 달린 게시글의 아이디",
  })
  postId: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: "댓글이 달린 게시글의 제목",
  })
  postTitle: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: "댓글의 내용",
  })
  commentContent: string;
  @Expose()
  @IsString()
  @ApiProperty({
    description: "댓글 작성자의 닉네임",
  })
  commentWriterNickname: string;

  constructor();

  constructor(param: Omit<CommentNotificationData, "type">);

  constructor(param?: Omit<CommentNotificationData, "type">) {
    super("comment");
    if (param) {
      Object.assign(this, param);
    }
  }
}

export class FollowNotificationData extends NotificationData {
  @Expose()
  @IsString()
  @ApiProperty({
    description: "나를 팔로우한 사용자 닉네임",
  })
  followerNickname: string;

  constructor();

  constructor(param: Omit<FollowNotificationData, "type">);

  constructor(param?: Omit<FollowNotificationData, "type">) {
    super("follow");
    if (param) {
      Object.assign(this, param);
    }
  }
}

export class MentionNotificationData extends CommentNotificationData {
  @Expose()
  @ApiProperty({
    description: "나를 멘션한 댓글 아이디",
  })
  commentId: string;

  constructor();

  constructor(param: Omit<MentionNotificationData, "type">);

  constructor(param?: Omit<MentionNotificationData, "type">) {
    super();
    this.type = "mention";
    if (param) {
      Object.assign(this, param);
    }
  }
}

export class PostDeletedNotificationData extends NotificationData {
  @Expose()
  @IsEnum(PostBoardType)
  @ApiProperty({
    description: "삭제된 게시글의 게시판",
    enum: PostBoardType,
  })
  boardType: PostBoardType;
  @Expose()
  @IsString()
  @ApiProperty({
    description: "삭제된 게시글의 아이디",
  })
  postId: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: "삭제된 게시글의 제목",
  })
  title: string;

  constructor(param?: Omit<PostDeletedNotificationData, "type">) {
    super("postDeleted");
    if (param) {
      Object.assign(this, param);
    }
  }
}

export class CommentDeletedNotificationData extends NotificationData {
  @Expose()
  @IsEnum(PostBoardType)
  @ApiProperty({
    description: "삭제된 댓글의 게시글의 게시판",
    enum: PostBoardType,
  })
  boardType: PostBoardType;
  @Expose()
  @IsString()
  @ApiProperty({
    description: "삭제된 댓글의 게시글의 아이디",
  })
  postId: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: "삭제된 댓글 아이디",
  })
  commentId: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: "삭제된 댓글의 게시글의 제목",
  })
  postTitle: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: "삭제된 댓글의 내용",
  })
  content: string;

  constructor(param?: Omit<CommentDeletedNotificationData, "type">) {
    super("commentDeleted");
    if (param) {
      Object.assign(this, param);
    }
  }
}

export type NotificationDataType = InstanceType<
  typeof NotificationDataTypes[number]
>;
export const NotificationDataTypes = [
  FollowNotificationData,
  MentionNotificationData,
  CommentNotificationData,
  CommentDeletedNotificationData,
  PostDeletedNotificationData,
] as const;

export const NotificationTypeMapping = {
  comment: CommentNotificationData,
  follow: FollowNotificationData,
  mention: MentionNotificationData,
  commentDeleted: CommentDeletedNotificationData,
  postDeleted: PostDeletedNotificationData,
} as Record<NotificationType, typeof NotificationDataTypes[number]>;

// export const NotificationDataTypes = [
//   CommentNotificationData,
//   MentionNotificationData,
//   FollowNotificationData,
//   PostDeletedNotificationData,
//   CommentDeletedNotificationData,
// ] as const;
// export type NotificationDataType = InstanceType<
//   typeof NotificationDataTypes[number]
// >;

@ApiExtraModels(...NotificationDataTypes)
export class Notification {
  @Expose()
  @ApiProperty({
    description: "알림의 고유 아이디",
  })
  notificationId: string;
  @Expose()
  @IsString()
  @ApiProperty({
    description: "알림을 받는 사용자 닉네임",
  })
  receiverNickname: string;

  @Expose()
  @IsBoolean()
  @ApiProperty({
    description: "알림을 읽었는지 여부",
  })
  read: boolean;

  @Expose()
  @IsDate()
  @ApiProperty({
    description: "알림 생성일",
  })
  createdAt: Date;

  @Type(() => NotificationData, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: "type",
      subTypes: NotificationTypes.map((type) => ({
        name: type,
        value: NotificationTypeMapping[type],
      })),
    },
  })
  @Expose()
  @ApiProperty({
    description: "알림 타입 별 세부 정보",
    discriminator: {
      propertyName: "type",
      mapping: NotificationTypes.map((type) => ({
        [type]: getSchemaPath(NotificationTypeMapping[type]),
      })).reduce((prev, current) => ({ ...prev, ...current }), {}),
    },
    oneOf: refs(...NotificationDataTypes),
    // oneOf: notificationDataTypes.map((t) => ({ $ref: getSchemaPath(t) })),
  })
  data: NotificationDataType;

  constructor(); // for class-transformer

  constructor(
    param: Omit<Notification, "notificationId" | "createdAt" | "read">,
  );

  constructor(
    param?: Omit<Notification, "notificationId" | "createdAt" | "read">,
  ) {
    if (param) {
      Object.assign(this, param);
      this.notificationId = new Types.ObjectId().toString();
      this.createdAt = getCurrentUTCTime();
      this.read = false;
    }
  }
}
