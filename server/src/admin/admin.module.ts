import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminCommandHandlers } from "./commands/handlers";
import { CqrsModule } from "@nestjs/cqrs";
import { PostsModule } from "../posts/posts.module";
import { CommentsModule } from "../comments/comments.module";
import { UsersModule } from "../users/users.module";
import { AdminQueryHandlers } from "./queries/handlers";

@Module({
  imports: [CqrsModule, PostsModule, CommentsModule, UsersModule],
  controllers: [AdminController],
  providers: [...AdminCommandHandlers, ...AdminQueryHandlers],
})
export class AdminModule {}
