import { Module } from "@nestjs/common";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";
import { MongooseModule } from "@nestjs/mongoose";
import { PostDocument, PostSchema } from "../schemas/post.schema";
import { PostCommandHandlers } from "./commands/handlers";
import { PostEventHandlers } from "./events/handlers";
import { PostQueryHandlers } from "./query/handlers";
import { CqrsModule } from "@nestjs/cqrs";
import { PostsRepository } from "./posts.repository";
import { UsersModule } from "../users/users.module";
import { UploadModule } from "../upload/upload.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PostDocument.name, schema: PostSchema },
    ]),
    CqrsModule,
    UsersModule,
    UploadModule,
  ],
  controllers: [PostsController],
  providers: [
    PostsRepository,
    PostsService,
    ...PostCommandHandlers,
    ...PostEventHandlers,
    ...PostQueryHandlers,
  ],
  exports: [PostsRepository],
})
export class PostsModule {}
