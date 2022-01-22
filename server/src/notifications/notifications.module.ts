import { Module } from "@nestjs/common";
import { NotificationsController } from "./notifications.controller";
import { NotificationsService } from "./notifications.service";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";
import {
  NotificationDocument,
  NotificationSchema,
} from "../schemas/notification.schema";
import { NotificationSaga } from "./sagas/notification.saga";
import { NotificationCommandHandlers } from "./commands/handlers";
import { NotificationsRepository } from "./notifications.repository";
import { NotificationQueryHandlers } from "./queries/handlers";

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: NotificationDocument.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsRepository,
    NotificationsService,
    NotificationSaga,
    ...NotificationCommandHandlers,
    ...NotificationQueryHandlers,
  ],
})
export class NotificationsModule {}
