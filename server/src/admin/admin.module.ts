import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminCommandHandlers } from "./commands/handlers";
import { CqrsModule } from "@nestjs/cqrs";
import { PostsModule } from "../posts/posts.module";
import { CommentsModule } from "../comments/comments.module";
import { UsersModule } from "../users/users.module";
import { UserSuspendService } from "./services/user-suspend.service";
import { UserDeleteService } from "./services/user-delete.service";

@Module({
  imports: [CqrsModule, PostsModule, CommentsModule, UsersModule],
  controllers: [AdminController],
  providers: [...AdminCommandHandlers, UserSuspendService, UserDeleteService],
})
export class AdminModule {}
