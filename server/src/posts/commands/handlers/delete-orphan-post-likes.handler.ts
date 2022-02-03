import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteOrphanPostLikesCommand } from "../delete-orphan-post-likes.command";
import { PostLikeService } from "../../services/post-like.service";

@CommandHandler(DeleteOrphanPostLikesCommand)
export class DeleteOrphanPostLikesHandler
  implements ICommandHandler<DeleteOrphanPostLikesCommand>
{
  constructor(private readonly postLikeService: PostLikeService) {}

  async execute(command: DeleteOrphanPostLikesCommand): Promise<any> {
    const { postIdentifier } = command;
    return this.postLikeService.removeOrphanPostLikes(postIdentifier);
  }
}
