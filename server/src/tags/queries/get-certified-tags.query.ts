import { IQuery } from "@nestjs/cqrs";
import { PostBoardType } from "../../models/post.model";

export class GetCertifiedTagsQuery implements IQuery {
  constructor(public readonly boardType: PostBoardType) {}
}
