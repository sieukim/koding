import { ICommand } from "@nestjs/cqrs";
import { PostIdentifier } from "../../models/post.model";
import { ModifyCommentRequestDto } from "../dto/modify-comment-request.dto";

export class ModifyCommentCommand implements ICommand {
  constructor(
    public readonly requestUserNickname: string,
    public readonly postIdentifier: PostIdentifier,
    public readonly commentId: string,
    public readonly modifyCommentRequest: ModifyCommentRequestDto,
  ) {}
}
