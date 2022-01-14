import { ICommand } from "@nestjs/cqrs";
import { PostBoardType } from "../../models/post.model";

export class RemoveCertifiedTagsCommand implements ICommand {
  constructor(
    public readonly boardType: PostBoardType,
    public readonly removeAllTags: boolean,
    public readonly tags?: string[],
  ) {}
}
