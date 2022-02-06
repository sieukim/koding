import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetScrapPostsQuery } from "../get-scrap-posts.query";
import { PostScrapService } from "../../../posts/services/post-scrap.service";
import { PostListDto } from "../../../posts/dto/post-list.dto";

@QueryHandler(GetScrapPostsQuery)
export class GetScrapPostsHandler implements IQueryHandler<GetScrapPostsQuery> {
  constructor(private readonly postScrapService: PostScrapService) {}

  async execute(query: GetScrapPostsQuery) {
    const { nickname } = query;
    const posts = await this.postScrapService.getScrapPost(nickname);
    return PostListDto.fromModel(posts, posts.length);
  }
}
