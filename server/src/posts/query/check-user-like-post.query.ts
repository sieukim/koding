import { IQuery } from "@nestjs/cqrs";
import { PostIdentifier } from "../../models/post.model";

export class CheckUserLikePostQuery implements IQuery {
  constructor(
    public readonly postIdentifier: PostIdentifier,
    public readonly nickname: string,
  ) {}
}
