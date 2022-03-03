import { Module } from "@nestjs/common";
import { NotificationsController } from "./notifications.controller";
import { NotificationsService } from "./notifications.service";
import { CqrsModule } from "@nestjs/cqrs";
import { NotificationSaga } from "./sagas/notification.saga";
import { NotificationCommandHandlers } from "./commands/handlers";
import { NotificationQueryHandlers } from "./queries/handlers";
import { CommentsModule } from "../comments/comments.module";
import { PostsModule } from "../posts/posts.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Notification } from "../entities/notification.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    CqrsModule,
    CommentsModule,
    PostsModule,
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    NotificationSaga,
    ...NotificationQueryHandlers,
    ...NotificationCommandHandlers,
  ],
})
export class NotificationsModule {}
