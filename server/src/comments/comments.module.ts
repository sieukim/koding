import { forwardRef, Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";
import { CommentDocument, CommentSchema } from "../schemas/comment.schema";
import { CommentsRepository } from "./comments.repository";
import { CommentsController } from "./comments.controller";
import { CommentCommandHandlers } from "./commands/handlers";
import { CommentQueryHandlers } from "./queries/handler";
import { UsersModule } from "../users/users.module";
import { PostsModule } from "../posts/posts.module";
import { CommentsSaga } from "./sagas/comments.saga";
import {
  CommentLikeDocument,
  CommentLikeSchema,
} from "../schemas/comment-like.schema";
import { CommentServices } from "./services";

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: CommentDocument.name,
        schema: CommentSchema,
      },
      {
        name: CommentLikeDocument.name,
        schema: CommentLikeSchema,
      },
    ]),
    forwardRef(() => UsersModule),
    PostsModule,
  ],
  controllers: [CommentsController],
  providers: [
    CommentsRepository,
    CommentsSaga,
    ...CommentServices,
    ...CommentCommandHandlers,
    ...CommentQueryHandlers,
  ],
  exports: [CommentsRepository],
})
export class CommentsModule {}
