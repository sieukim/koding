import { CacheModule, forwardRef, Module } from "@nestjs/common";
import { PostsController } from "./posts.controller";
import { PostCommandHandlers } from "./commands/handlers";
import { PostEventHandlers } from "./events/handlers";
import { PostQueryHandlers } from "./query/handlers";
import { CqrsModule } from "@nestjs/cqrs";
import { UsersModule } from "../users/users.module";
import { UploadModule } from "../upload/upload.module";
import { PostsSaga } from "./sagas/posts.saga";
import { PostServices } from "./services";
import { PostRankingController } from "./post-ranking.controller";
import { ConfigService } from "@nestjs/config";
import * as redisStore from "cache-manager-ioredis";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Post } from "../entities/post.entity";
import { PostLike } from "../entities/post-like.entity";
import { PostScrap } from "../entities/post-scrap.entity";
import { PostDailyRanking } from "../entities/post-daily-ranking.entity";
import { PostReport } from "../entities/post-report.entity";

@Module({
  imports: [
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<any, true>) => ({
        isGlobal: true,
        store: redisStore,
        host: configService.get<string>("database.redis.host"),
        port: configService.get<number>("database.redis.port"),
      }),
    }),
    TypeOrmModule.forFeature([
      Post,
      PostLike,
      PostScrap,
      PostReport,
      PostDailyRanking,
    ]),
    CqrsModule,
    forwardRef(() => UsersModule),
    UploadModule,
  ],
  controllers: [PostsController, PostRankingController],
  providers: [
    PostsSaga,
    ...PostServices,
    ...PostCommandHandlers,
    ...PostEventHandlers,
    ...PostQueryHandlers,
  ],
  exports: [...PostServices],
})
export class PostsModule {}
