import { IsDate, IsIn, IsString } from "class-validator";
import { PostBoardType, postBoardTypes } from "./post.model";
import {
  ApiExtraModels,
  ApiProperty,
  getSchemaPath,
  refs,
} from "@nestjs/swagger";
import { Types } from "mongoose";
import { currentTime } from "../common/utils/current-time.util";
import { Expose, Type } from "class-transformer";

export const notificationTypes = ["comment", "follow", "mention"] as const;
export type NotificationType = typeof notificationTypes[number];

export abstract class NotificationData {
  @Expose()
  @IsIn(notificationTypes)
  @ApiProperty({
    description: "알림 타입",
    enum: notificationTypes,
  })
  type: NotificationType;

  protected constructor(type: NotificationType) {
    this.type = type;
  }
}

export class CommentNotificationData extends NotificationData {
  @Expose()
  @IsIn(postBoardTypes)
  @ApiProperty({
    description: "댓글이 달린 게시글의 게시판",
    enum: postBoardTypes,
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

export const notificationDataTypes = [
  CommentNotificationData,
  MentionNotificationData,
  FollowNotificationData,
] as const;
export type NotificationDataType = InstanceType<
  typeof notificationDataTypes[number]
>;

@ApiExtraModels(
  CommentNotificationData,
  FollowNotificationData,
  MentionNotificationData,
)
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
  @IsDate()
  @ApiProperty({
    description: "알림 생성일",
  })
  createdAt: Date;
  @Type(() => NotificationData, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: "type",
      subTypes: [
        {
          name: "follow",
          value: FollowNotificationData,
        },
        {
          name: "mention",
          value: MentionNotificationData,
        },
        {
          name: "comment",
          value: CommentNotificationData,
        },
      ],
    },
  })
  @Expose()
  @ApiProperty({
    description: "알림 타입 별 세부 정보",
    discriminator: {
      propertyName: "type",
      mapping: {
        mention: getSchemaPath(MentionNotificationData),
        follow: getSchemaPath(FollowNotificationData),
        comment: getSchemaPath(CommentNotificationData),
      },
    },
    oneOf: refs(...notificationDataTypes),
    // oneOf: notificationDataTypes.map((t) => ({ $ref: getSchemaPath(t) })),
  })
  data: NotificationDataType;

  constructor(); // for class-transformer

  constructor(param: Omit<Notification, "notificationId" | "createdAt">);

  constructor(param?: Omit<Notification, "notificationId" | "createdAt">) {
    console.log("param:", param);
    if (param) {
      this.notificationId = new Types.ObjectId().toString();
      this.createdAt = currentTime();
      Object.assign(this, param);
    }
  }
}
