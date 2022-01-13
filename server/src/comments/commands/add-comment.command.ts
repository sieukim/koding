import { ICommand } from "@nestjs/cqrs";
import { PostIdentifier } from "../../models/post.model";
import { AddCommentRequestDto } from "../dto/add-comment-request.dto";

export class AddCommentCommand implements ICommand {
  constructor(
    public readonly writerNickname: string,
    public readonly postIdentifier: PostIdentifier,
    public readonly addCommentRequest: AddCommentRequestDto,
  ) {}
}
