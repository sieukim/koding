import { ICommand } from "@nestjs/cqrs";
import { PostIdentifier } from "../../models/post.model";
import { ModifyPostRequestDto } from "../dto/modify-post-request.dto";

export class ModifyPostCommand implements ICommand {
  constructor(
    public readonly requestUserNickname: string,
    public readonly postIdentifier: PostIdentifier,
    public readonly modifyPostRequest: ModifyPostRequestDto,
  ) {}
}
