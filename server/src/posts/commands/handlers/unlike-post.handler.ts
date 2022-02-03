import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UnlikePostCommand } from "../unlike-post.command";
import { PostLikeService } from "../../services/post-like.service";

@CommandHandler(UnlikePostCommand)
export class UnlikePostHandler
  implements ICommandHandler<UnlikePostCommand, number>
{
  constructor(private readonly postLikeService: PostLikeService) {}

  async execute(command: UnlikePostCommand): Promise<number> {
    const { postIdentifier, nickname } = command;
    return this.postLikeService.unlikePost(postIdentifier, nickname);
  }
}
