import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { DeletePostCommand } from "../delete-post.command";
import { TagChangedEvent } from "../../../tags/events/tag-changed.event";
import { PostImageChangedEvent } from "../../../upload/event/post-image-changed.event";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { Post } from "../../../entities/post.entity";
import { orThrowNotFoundPost } from "../../../common/utils/or-throw";

@CommandHandler(DeletePostCommand)
export class DeletePostHandler implements ICommandHandler<DeletePostCommand> {
  constructor(private readonly eventBus: EventBus) {}

  @Transaction()
  async execute(
    command: DeletePostCommand,
    @TransactionManager() tm?: EntityManager,
  ): Promise<void> {
    const em = tm!;
    const {
      postIdentifier: { postId, boardType },
      requestUserNickname,
    } = command;
    const post = await em
      .findOneOrFail(Post, { where: { postId, boardType } })
      .catch(orThrowNotFoundPost);
    post.verifyOwner(requestUserNickname);
    await em.remove(post);

    this.eventBus.publishAll([
      new PostImageChangedEvent(post.postId, post.imageUrls, []),
      new TagChangedEvent(post.boardType, post.tags, []),
    ]);
  }
}
