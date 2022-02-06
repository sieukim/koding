import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LikePostCommand } from "../like-post.command";
import { PostLikeService } from "../../services/post-like.service";

@CommandHandler(LikePostCommand)
export class LikePostHandler implements ICommandHandler<LikePostCommand, void> {
  constructor(private readonly postLikeService: PostLikeService) {}

  async execute(command: LikePostCommand): Promise<void> {
    const { postIdentifier, nickname } = command;
    await this.postLikeService.likePost(postIdentifier, nickname);
    return;
  }
}
