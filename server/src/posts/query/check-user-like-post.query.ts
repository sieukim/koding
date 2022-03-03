import { IQuery } from "@nestjs/cqrs";
import { PostIdentifier } from "../../entities/post.entity";

export class CheckUserLikePostQuery implements IQuery {
  constructor(
    public readonly postIdentifier: PostIdentifier,
    public readonly nickname: string,
  ) {}
}
