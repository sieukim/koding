import { Injectable } from "@nestjs/common";
import { User } from "../models/user.model";
import { PostIdentifier } from "../models/post.model";
import { AddCommentRequestDto } from "./dto/add-comment-request.dto";
import { AddCommentCommand } from "./commands/add-comment.command";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ModifyCommentRequestDto } from "./dto/modify-comment-request.dto";
import { ModifyCommentCommand } from "./commands/modify-comment.command";
import { DeleteCommentCommand } from "./commands/delete-comment.command";

@Injectable()
export class CommentsService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async addComment(
    requestUser: User,
    postIdentifier: PostIdentifier,
    addCommentRequest: AddCommentRequestDto,
  ) {
    return this.commandBus.execute(
      new AddCommentCommand(
        requestUser.nickname,
        postIdentifier,
        addCommentRequest,
      ),
    );
  }

  async modifyComment(
    requestUser: User,
    postIdentifier: PostIdentifier,
    commentId: string,
    modifyCommentRequest: ModifyCommentRequestDto,
  ) {
    return this.commandBus.execute(
      new ModifyCommentCommand(
        requestUser.nickname,
        postIdentifier,
        commentId,
        modifyCommentRequest,
      ),
    );
  }

  async deleteComment(
    requestUser: User,
    postIdentifier: PostIdentifier,
    commentId: string,
  ) {
    return this.commandBus.execute(
      new DeleteCommentCommand(requestUser.nickname, postIdentifier, commentId),
    );
  }
}
