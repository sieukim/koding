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
import { CommentsModule } from "../comments/comments.module";
import { PostsModule } from "../posts/posts.module";

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: NotificationDocument.name, schema: NotificationSchema },
    ]),
    CommentsModule,
    PostsModule,
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsRepository,
    NotificationsService,
    NotificationSaga,
    ...NotificationQueryHandlers,
    ...NotificationCommandHandlers,
  ],
})
export class NotificationsModule {}
