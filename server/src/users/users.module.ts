import { forwardRef, Global, Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { UserDocument, UserSchema } from "../schemas/user.schema";
import { UsersService } from "./users.service";
import { EmailModule } from "../email/email.module";
import { UsersRepository } from "./users.repository";
import { UserCommandHandlers } from "./commands/handlers";
import { UserEventHandlers } from "./events/handlers";
import { UserQueryHandlers } from "./queries/handlers";
import { CqrsModule } from "@nestjs/cqrs";
import { EmailSagas } from "./sagas/email.sagas";
import { PostsModule } from "../posts/posts.module";
import { CommentsModule } from "../comments/comments.module";
import {
  PostScrapDocument,
  PostScrapSchema,
} from "../schemas/post-scrap.schema";

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
      { name: PostScrapDocument.name, schema: PostScrapSchema },
    ]),
    EmailModule,
    CqrsModule,
    forwardRef(() => PostsModule),
    forwardRef(() => CommentsModule),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    EmailSagas,
    ...UserCommandHandlers,
    ...UserEventHandlers,
    ...UserQueryHandlers,
  ],
  exports: [UsersRepository, UsersService],
})
export class UsersModule {}
