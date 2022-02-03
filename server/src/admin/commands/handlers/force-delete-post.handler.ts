import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { ForceDeletePostCommand } from "../force-delete-post.command";
import { PostsRepository } from "../../../posts/posts.repository";
import { NotFoundException } from "@nestjs/common";
import { PostDeletedByAdminEvent } from "../../events/post-deleted-by-admin.event";

@CommandHandler(ForceDeletePostCommand)
export class ForceDeletePostHandler
  implements ICommandHandler<ForceDeletePostCommand>
{
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: ForceDeletePostCommand): Promise<void> {
    const { postIdentifier } = command;
    const post = await this.postsRepository.findByPostId(postIdentifier);
    if (!post) throw new NotFoundException("없는 게시글");
    await this.postsRepository.remove(post);
    if (post.writerNickname)
      this.eventBus.publish(
        new PostDeletedByAdminEvent(postIdentifier, post.writerNickname),
      );
  }
}
