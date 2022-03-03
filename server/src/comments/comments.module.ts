import { forwardRef, Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { CommentsController } from "./comments.controller";
import { CommentCommandHandlers } from "./commands/handlers";
import { CommentQueryHandlers } from "./queries/handler";
import { UsersModule } from "../users/users.module";
import { PostsModule } from "../posts/posts.module";
import { CommentsSaga } from "./sagas/comments.saga";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Comment } from "../entities/comment.entity";
import { CommentLike } from "../entities/comment-like.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, CommentLike]),
    CqrsModule,
    forwardRef(() => UsersModule),
    PostsModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsSaga, ...CommentCommandHandlers, ...CommentQueryHandlers],
  exports: [],
})
export class CommentsModule {}
