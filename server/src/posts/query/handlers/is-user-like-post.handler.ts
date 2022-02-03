import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { IsUserLikePostQuery } from "../is-user-like-post.query";
import { PostLikeService } from "../../services/post-like.service";
import { UserLikePostInfoDto } from "../../dto/user-like-post-info.dto";

@QueryHandler(IsUserLikePostQuery)
export class IsUserLikePostHandler
  implements IQueryHandler<IsUserLikePostQuery>
{
  constructor(private readonly postLikeService: PostLikeService) {}

  async execute(query: IsUserLikePostQuery): Promise<any> {
    const { postIdentifier, nickname } = query;
    const isUserLiked = await this.postLikeService.isUserLikePost(
      postIdentifier,
      nickname,
    );
    return new UserLikePostInfoDto(postIdentifier, nickname, isUserLiked);
  }
}
