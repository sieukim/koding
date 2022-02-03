import { forwardRef, Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";
import { CommentDocument, CommentSchema } from "../schemas/comment.schema";
import { CommentsRepository } from "./comments.repository";
import { CommentsController } from "./comments.controller";
import { CommentsService } from "./comments.service";
import { CommentCommandHandlers } from "./commands/handlers";
import { CommentQueryHandlers } from "./queries/handler";
import { UsersModule } from "../users/users.module";
import { PostsModule } from "../posts/posts.module";
import { CommentsSaga } from "./sagas/comments.saga";

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: CommentDocument.name,
        schema: CommentSchema,
      },
    ]),
    forwardRef(() => UsersModule),
    PostsModule,
  ],
  controllers: [CommentsController],
  providers: [
    CommentsRepository,
    CommentsService,
    CommentsSaga,
    ...CommentCommandHandlers,
    ...CommentQueryHandlers,
  ],
  exports: [CommentsRepository],
})
export class CommentsModule {}
