import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { CheckUserLikePostQuery } from "../check-user-like-post.query";
import { PostLikeService } from "../../services/post-like.service";
import { UserLikePostInfoDto } from "../../dto/user-like-post-info.dto";

@QueryHandler(CheckUserLikePostQuery)
export class CheckUserLikePostHandler
  implements IQueryHandler<CheckUserLikePostQuery>
{
  constructor(private readonly postLikeService: PostLikeService) {}

  async execute(query: CheckUserLikePostQuery): Promise<any> {
    const { postIdentifier, nickname } = query;
    const isUserLiked = await this.postLikeService.isUserLikePost(
      postIdentifier,
      nickname,
    );
    return new UserLikePostInfoDto(postIdentifier, nickname, isUserLiked);
  }
}
