import { ICommand } from "@nestjs/cqrs";
import { PostIdentifier } from "../../entities/post.entity";

export class ReportPostCommand implements ICommand {
  constructor(
    public readonly postIdentifier: PostIdentifier,
    public readonly nickname: string,
    public readonly reportReason: string,
  ) {}
}
