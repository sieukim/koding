import { ICommand } from "@nestjs/cqrs";
import { PostIdentifier } from "../../entities/post.entity";

export class DeletePostCommand implements ICommand {
  constructor(
    public readonly requestUserNickname: string,
    public readonly postIdentifier: PostIdentifier,
  ) {}
}
