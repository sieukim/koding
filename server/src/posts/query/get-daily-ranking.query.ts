import { PostBoardType } from "../../entities/post-board.type";

export class GetDailyRankingQuery {
  constructor(
    public readonly boardType: PostBoardType,
    public readonly pageSize: number,
  ) {}
}
