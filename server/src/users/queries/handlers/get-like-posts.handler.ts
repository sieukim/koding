import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetLikePostsQuery } from "../get-like-posts.query";
import { PostLikeService } from "../../../posts/services/post-like.service";
import { PostListDto } from "../../../posts/dto/post-list.dto";

@QueryHandler(GetLikePostsQuery)
export class GetLikePostsHandler implements IQueryHandler<GetLikePostsQuery> {
  constructor(private readonly postLikeService: PostLikeService) {}

  async execute(query: GetLikePostsQuery) {
    const { nickname } = query;
    const posts = await this.postLikeService.getLikePosts(nickname);
    return PostListDto.fromModel(posts, posts.length);
  }
}
