import { ICommand } from "@nestjs/cqrs";
import { PostIdentifier } from "../../models/post.model";

export class DeletePostCommand implements ICommand {
  constructor(
    public readonly requestUserNickname: string,
    public readonly postIdentifier: PostIdentifier,
  ) {}
}
