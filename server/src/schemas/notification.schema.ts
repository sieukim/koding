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
  _id: Types.ObjectId;

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
    console.log("before id:", json.notificationId, document.notificationId);
    const result = plainToClass(Notification, json, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
    console.log("after id:", result.notificationId);
    return result;
  }
}

export const NotificationSchema =
  SchemaFactory.createForClass(NotificationDocument);
NotificationSchema.index({ receiverNickname: 1, createdAt: 1 });
NotificationSchema.virtual("notificationId")
  .get(function () {
    console.log("call getter");
    return this._id;
  })
  .set(function (value) {
    if (value instanceof Types.ObjectId) this._id = value;
    else this._id = new Types.ObjectId(value);
  });
NotificationSchema.set("toJSON", { virtuals: true });
NotificationSchema.set("toObject", { virtuals: true });
