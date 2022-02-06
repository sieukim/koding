import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { CheckUserScrapPostQuery } from "../check-user-scrap-post.query";
import { PostScrapService } from "../../services/post-scrap.service";
import { UserScrapPostInfoDto } from "../../dto/user-scrap-post-info.dto";

@QueryHandler(CheckUserScrapPostQuery)
export class CheckUserScrapPostHandler
  implements IQueryHandler<CheckUserScrapPostQuery>
{
  constructor(private readonly postScrapService: PostScrapService) {}

  async execute(query: CheckUserScrapPostQuery): Promise<any> {
    const { postIdentifier, nickname } = query;
    const isUserScraped = await this.postScrapService.isUserScrapPost(
      postIdentifier,
      nickname,
    );
    return new UserScrapPostInfoDto(postIdentifier, nickname, isUserScraped);
  }
}
