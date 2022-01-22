import { Injectable } from "@nestjs/common";

import { ModifyPostRequestDto } from "./dto/modify-post-request.dto";
import { WritePostRequestDto } from "./dto/write-post-request.dto";
import { CommandBus } from "@nestjs/cqrs";
import { WritePostCommand } from "./commands/write-post.command";
import { ModifyPostCommand } from "./commands/modify-post.command";
import { DeletePostCommand } from "./commands/delete-post.command";
import { WritePostHandler } from "./commands/handlers/write-post.handler";
import { ModifyPostHandler } from "./commands/handlers/modify-post.handler";
import { DeletePostHandler } from "./commands/handlers/delete-post.handler";
import { PostBoardType, PostIdentifier } from "../models/post.model";
import { User } from "../models/user.model";

@Injectable()
export class PostsService {
  constructor(private readonly commandBus: CommandBus) {}

  writePost(
    boardType: PostBoardType,
    writer: User,
    writePostRequest: WritePostRequestDto,
  ) {
    return this.commandBus.execute(
      new WritePostCommand(boardType, writer.nickname, writePostRequest),
    ) as ReturnType<WritePostHandler["execute"]>;
  }

  modifyPost(
    requestUser: User,
    postIdentifier: PostIdentifier,
    modifyPostRequestDto: ModifyPostRequestDto,
  ) {
    return this.commandBus.execute(
      new ModifyPostCommand(
        requestUser.nickname,
        postIdentifier,
        modifyPostRequestDto,
      ),
    ) as ReturnType<ModifyPostHandler["execute"]>;
  }

  deletePost(requestUser: User, postIdentifier: PostIdentifier) {
    return this.commandBus.execute(
      new DeletePostCommand(requestUser.nickname, postIdentifier),
    ) as ReturnType<DeletePostHandler["execute"]>;
  }
}
