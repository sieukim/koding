import { MongooseBaseRepository } from "../common/repository/mongoose-base.repository";
import { Notification } from "../models/notification.model";
import { NotificationDocument } from "../schemas/notification.schema";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

export class NotificationsRepository extends MongooseBaseRepository<
  Notification,
  NotificationDocument
> {
  constructor(
    @InjectModel(NotificationDocument.name)
    private readonly notificationModel: Model<NotificationDocument>,
  ) {
    super(
      NotificationDocument.toModel,
      NotificationDocument.fromModel,
      notificationModel,
      ["notificationId"],
      "notificationId",
    );
  }

  async persist(model: Notification): Promise<Notification> {
    const document = this.fromModel(model, this.notificationModel);
    console.dir(document.data);
    await this.notificationModel.replaceOne({ _id: document._id }, document, {
      upsert: true,
    });
    return this.toModel(document);
  }

  async remove(model: Notification): Promise<boolean> {
    const deletedResult = await this.notificationModel
      .deleteOne({
        _id: new Types.ObjectId(model.notificationId),
      })
      .exec();
    return deletedResult.deletedCount === 1;
  }

  async update(model: Notification): Promise<Notification> {
    const document = this.fromModel(model, this.notificationModel);
    await this.notificationModel.replaceOne({ _id: document._id }, document);
    return this.toModel(document);
  }
}
