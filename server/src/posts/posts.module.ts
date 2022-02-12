import { forwardRef, Module } from "@nestjs/common";
import { PostsController } from "./posts.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { PostDocument, PostSchema } from "../schemas/post.schema";
import { PostCommandHandlers } from "./commands/handlers";
import { PostEventHandlers } from "./events/handlers";
import { PostQueryHandlers } from "./query/handlers";
import { CqrsModule } from "@nestjs/cqrs";
import { PostsRepository } from "./posts.repository";
import { UsersModule } from "../users/users.module";
import { UploadModule } from "../upload/upload.module";
import { PostsSaga } from "./sagas/posts.saga";
import { PostServices } from "./services";
import { PostLikeDocument, PostLikeSchema } from "../schemas/post-like.schema";
import {
  PostDailyRankingDocument,
  PostDailyRankingSchema,
} from "../schemas/post-daliy-ranking.schema";
import { PostRankingController } from "./post-ranking.controller";
import {
  PostScrapDocument,
  PostScrapSchema,
} from "../schemas/post-scrap.schema";
import {
  PostReportDocument,
  PostReportSchema,
} from "../schemas/post-report.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PostDocument.name, schema: PostSchema },
      { name: PostLikeDocument.name, schema: PostLikeSchema },
      { name: PostScrapDocument.name, schema: PostScrapSchema },
      {
        name: PostDailyRankingDocument.name,
        schema: PostDailyRankingSchema,
      },
      { name: PostReportDocument.name, schema: PostReportSchema },
    ]),
    CqrsModule,
    forwardRef(() => UsersModule),
    UploadModule,
  ],
  controllers: [PostsController, PostRankingController],
  providers: [
    PostsRepository,
    PostsSaga,
    ...PostServices,
    ...PostCommandHandlers,
    ...PostEventHandlers,
    ...PostQueryHandlers,
  ],
  exports: [PostsRepository, ...PostServices],
})
export class PostsModule {}
