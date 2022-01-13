import { IQuery } from "@nestjs/cqrs";
import { PostIdentifier } from "../../models/post.model";

export class ReadCommentQuery implements IQuery {
  constructor(public readonly postIdentifier: PostIdentifier) {}
}
