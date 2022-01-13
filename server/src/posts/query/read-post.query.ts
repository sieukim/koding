import { IQuery } from "@nestjs/cqrs";
import { PostIdentifier } from "../../models/post.model";

export class ReadPostQuery implements IQuery {
  constructor(public readonly postIdentifier: PostIdentifier) {}
}
