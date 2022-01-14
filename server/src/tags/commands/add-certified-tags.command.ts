import { ICommand } from "@nestjs/cqrs";
import { PostBoardType } from "../../models/post.model";

export class AddCertifiedTagsCommand implements ICommand {
  constructor(
    public readonly boardType: PostBoardType,
    public readonly tags: string[],
  ) {}
}
