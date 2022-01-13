import { Injectable } from "@nestjs/common";
import { PostBoardType } from "../schemas/post.schema";
import { ModifyPostRequestDto } from "./dto/modify-post-request.dto";
import { WritePostRequestDto } from "./dto/write-post-request.dto";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { WritePostCommand } from "./commands/write-post.command";
import { GetPostListQuery } from "./query/get-post-list.query";
import { ReadPostQuery } from "./query/read-post.query";
import { ModifyPostCommand } from "./commands/modify-post.command";
import { DeletePostCommand } from "./commands/delete-post.command";
import { WritePostHandler } from "./commands/handlers/write-post.handler";
import { GetPostListHandler } from "./query/handlers/get-post-list.handler";
import { ReadPostHandler } from "./query/handlers/read-post.handler";
import { ModifyPostHandler } from "./commands/handlers/modify-post.handler";
import { DeletePostHandler } from "./commands/handlers/delete-post.handler";
import { PostIdentifier } from "../models/post.model";
import { User } from "../models/user.model";

@Injectable()
export class PostsService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  writePost(
    boardType: PostBoardType,
    writer: User,
    writePostRequest: WritePostRequestDto,
  ) {
    return this.commandBus.execute(
      new WritePostCommand(boardType, writer.nickname, writePostRequest),
    ) as ReturnType<WritePostHandler["execute"]>;
  }

  getPostsWithCursor(
    boardType: PostBoardType,
    pageSize: number,
    cursorPostId: string | undefined,
    searchQuery?: {
      tags?: string[];
    },
  ) {
    return this.queryBus.execute(
      new GetPostListQuery(boardType, pageSize, cursorPostId, searchQuery),
    ) as ReturnType<GetPostListHandler["execute"]>;
  }

  readPost(postIdentifier: PostIdentifier) {
    return this.queryBus.execute(
      new ReadPostQuery(postIdentifier),
    ) as ReturnType<ReadPostHandler["execute"]>;
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
