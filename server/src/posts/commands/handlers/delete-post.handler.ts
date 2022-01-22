import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { DeletePostCommand } from "../delete-post.command";
import { PostsRepository } from "../../posts.repository";
import { UsersRepository } from "../../../users/users.repository";
import { TagChangedEvent } from "../../../tags/events/tag-changed.event";
import { PostImageChangedEvent } from "../../../upload/event/post-image-changed.event";

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
    post.verifyOwner(requestUser);
    await this.postRepository.remove(post);
    this.eventBus.publish(
      new PostImageChangedEvent(post.postId, post.imageUrls, []),
    );
    this.eventBus.publish(new TagChangedEvent(post.boardType, post.tags, []));
  }
}
