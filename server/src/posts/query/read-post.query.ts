import { IQuery } from "@nestjs/cqrs";
import { PostIdentifier } from "../../entities/post.entity";

export class ReadPostQuery implements IQuery {
  constructor(
    public readonly postIdentifier: PostIdentifier,
    public readonly readerIp: string,
    public readonly readerNickname?: string,
  ) {}
}
