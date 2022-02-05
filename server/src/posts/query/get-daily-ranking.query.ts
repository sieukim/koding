import { PostBoardType } from "../../models/post.model";

export class GetDailyRankingQuery {
  constructor(
    public readonly boardType: PostBoardType,
    public readonly pageSize: number,
  ) {}
}
