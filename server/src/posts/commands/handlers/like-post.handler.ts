import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LikePostCommand } from "../like-post.command";
import { PostLikeService } from "../../services/post-like.service";

@CommandHandler(LikePostCommand)
export class LikePostHandler
  implements ICommandHandler<LikePostCommand, number>
{
  constructor(private readonly postLikeService: PostLikeService) {}

  async execute(command: LikePostCommand): Promise<number> {
    const { postIdentifier, nickname } = command;
    return this.postLikeService.likePost(postIdentifier, nickname);
  }
}
