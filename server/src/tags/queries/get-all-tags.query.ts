import { IQuery } from "@nestjs/cqrs";
import { PostBoardType } from "../../models/post.model";

export class GetAllTagsQuery implements IQuery {
  constructor(public readonly boardType: PostBoardType) {}
}
