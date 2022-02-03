import { Document, Model, SchemaTypes, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { currentTime } from "../common/utils/current-time.util";
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
    currentTime: currentTime,
  },
})
export class NotificationDocument extends Document {
  notificationId: string;

  @Prop({ type: String })
  type: NotificationType;

  @Prop({ type: String })
  receiverNickname: string;

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
NotificationSchema.index({ receiverNickname: 1, createdAt: 1 });
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
