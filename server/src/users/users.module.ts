import { forwardRef, Global, Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { EmailModule } from "../email/email.module";
import { UserCommandHandlers } from "./commands/handlers";
import { UserEventHandlers } from "./events/handlers";
import { UserQueryHandlers } from "./queries/handlers";
import { CqrsModule } from "@nestjs/cqrs";
import { EmailSagas } from "./sagas/email.sagas";
import { PostsModule } from "../posts/posts.module";
import { CommentsModule } from "../comments/comments.module";
import { UploadModule } from "../upload/upload.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { Follow } from "../entities/follow.entity";
import { EmailVerifyToken } from "../entities/email-verify-token.entity";
import { TemporaryGithubUser } from "../entities/temporary-github-user.entity";

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Follow,
      EmailVerifyToken,
      TemporaryGithubUser,
    ]),
    EmailModule,
    CqrsModule,
    forwardRef(() => PostsModule),
    forwardRef(() => CommentsModule),
    UploadModule,
  ],
  controllers: [UsersController],
  providers: [
    EmailSagas,
    ...UserCommandHandlers,
    ...UserEventHandlers,
    ...UserQueryHandlers,
  ],
  exports: [],
})
export class UsersModule {}
