import { IQuery } from "@nestjs/cqrs";
import { PostBoardType } from "../../entities/post-board.type";

export class GetWritingCommentsQuery implements IQuery {
  constructor(
    public readonly nickname: string,
    public readonly boardType: PostBoardType,
    public readonly pageSize: number,
    public readonly cursor?: string,
  ) {}
}
