import { ICommand } from "@nestjs/cqrs";
import { PostBoardType } from "../../entities/post-board.type";

export class AddCertifiedTagsCommand implements ICommand {
  constructor(
    public readonly boardType: PostBoardType,
    public readonly tags: string[],
  ) {}
}
