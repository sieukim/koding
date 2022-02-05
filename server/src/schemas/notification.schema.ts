import { Document, Model, SchemaTypes, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { getCurrentTime } from "../common/utils/time.util";
import {
  Notification,
  NotificationDataType,
  NotificationType,
} from "../models/notification.model";
import { plainToClass } from "class-transformer";

@Schema({
  id: false,
  _id: true,
  autoIndex: true,
  versionKey: false,
  timestamps: {
    createdAt: true,
    updatedAt: false,
    currentTime: getCurrentTime,
  },
})
export class NotificationDocument extends Document {
  notificationId: string;

  @Prop({ type: String })
  type: NotificationType;

  @Prop({ type: String })
  receiverNickname: string;

  @Prop({ type: Boolean, default: false })
  read: boolean;

  createdAt: Date;

  @Prop({ type: SchemaTypes.Mixed })
  data: NotificationDataType;

  static fromModel(
    model: Notification,
    mongooseModel: Model<NotificationDocument>,
  ): NotificationDocument {
    return new mongooseModel(model);
  }

  static toModel(document: NotificationDocument): Notification {
    const json = document.toJSON();
    return plainToClass(Notification, json, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }
}

export const NotificationSchema =
  SchemaFactory.createForClass(NotificationDocument);
NotificationSchema.index({ receiverNickname: 1, createdAt: 1 }); // 사용자가 알림 조회 시 시간순으로 보여주기 위해
NotificationSchema.index({ receiverNickname: 1, read: 1 }); // 사용자가 안 읽은 알람이 있는지 여부를 조회할 때, 안 읽은 알람을 모두 읽음 처리 할 때
NotificationSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 7 }, // 7일 뒤 자동삭제
);
NotificationSchema.virtual("notificationId")
  .get(function () {
    return this._id.toString();
  })
  .set(function (value) {
    if (value instanceof Types.ObjectId) this._id = value;
    else this._id = new Types.ObjectId(value);
  });
NotificationSchema.set("toJSON", { virtuals: true });
NotificationSchema.set("toObject", { virtuals: true });
