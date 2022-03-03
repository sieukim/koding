import { IQuery } from "@nestjs/cqrs";
import { PostBoardType } from "../../entities/post-board.type";

export class GetAllTagsQuery implements IQuery {
  constructor(public readonly boardType: PostBoardType) {}
}
