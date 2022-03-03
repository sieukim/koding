import { ICommand } from "@nestjs/cqrs";
import { PostBoardType } from "../../entities/post-board.type";

export class RemoveCertifiedTagsCommand implements ICommand {
  constructor(
    public readonly boardType: PostBoardType,
    public readonly removeAllTags: boolean,
    public readonly tags?: string[],
  ) {}
}
