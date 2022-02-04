import { MongooseBaseRepository } from "../common/repository/mongoose-base.repository";
import { Notification } from "../models/notification.model";
import { NotificationDocument } from "../schemas/notification.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { FindOption } from "../common/repository/find-option";

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
      .deleteOne(
        this.parseFindOption({ notificationId: { eq: model.notificationId } }),
      )
      .exec();
    return deletedResult.deletedCount === 1;
  }

  async update(model: Notification): Promise<Notification> {
    const document = this.fromModel(model, this.notificationModel);
    await this.notificationModel.replaceOne({ _id: document._id }, document);
    return this.toModel(document);
  }

  exists(findOption: FindOption<Notification>) {
    return this.notificationModel.exists(this.parseFindOption(findOption));
  }
}
