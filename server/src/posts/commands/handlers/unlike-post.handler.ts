import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UnlikePostCommand } from "../unlike-post.command";
import { PostLikeService } from "../../services/post-like.service";

@CommandHandler(UnlikePostCommand)
export class UnlikePostHandler
  implements ICommandHandler<UnlikePostCommand, void>
{
  constructor(private readonly postLikeService: PostLikeService) {}

  async execute(command: UnlikePostCommand): Promise<void> {
    const { postIdentifier, nickname } = command;
    await this.postLikeService.unlikePost(postIdentifier, nickname);
    return;
  }
}
