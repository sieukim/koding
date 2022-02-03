import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { DeletePostCommand } from "../delete-post.command";
import { PostsRepository } from "../../posts.repository";
import { UsersRepository } from "../../../users/users.repository";
import { TagChangedEvent } from "../../../tags/events/tag-changed.event";
import { PostImageChangedEvent } from "../../../upload/event/post-image-changed.event";
import { PostDeletedEvent } from "../../events/post-deleted.event";
import { NotFoundException } from "@nestjs/common";

@CommandHandler(DeletePostCommand)
export class DeletePostHandler implements ICommandHandler<DeletePostCommand> {
  constructor(
    private readonly postRepository: PostsRepository,
    private readonly userRepository: UsersRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeletePostCommand): Promise<void> {
    const { postIdentifier, requestUserNickname } = command;
    const requestUser = await this.userRepository.findByNickname(
      requestUserNickname,
    );
    const post = await this.postRepository.findByPostId(postIdentifier);
    if (!post) throw new NotFoundException("잘못된 게시글");
    post.verifyOwner(requestUser);
    await this.postRepository.remove(post);

    this.eventBus.publishAll([
      new PostImageChangedEvent(post.postId, post.imageUrls, []),
      new PostDeletedEvent(postIdentifier, post.writerNickname),
      new TagChangedEvent(post.boardType, post.tags, []),
    ]);
  }
}
