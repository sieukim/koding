import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { ForceDeletePostCommand } from "../force-delete-post.command";
import { PostDeletedByAdminEvent } from "../../events/post-deleted-by-admin.event";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { orThrowNotFoundPost } from "../../../common/utils/or-throw";
import { Post } from "../../../entities/post.entity";

@CommandHandler(ForceDeletePostCommand)
export class ForceDeletePostHandler
  implements ICommandHandler<ForceDeletePostCommand>
{
  constructor(private readonly eventBus: EventBus) {}

  @Transaction()
  async execute(
    command: ForceDeletePostCommand,
    @TransactionManager() tm?: EntityManager,
  ) {
    const em = tm!;
    const {
      postIdentifier: { postId, boardType },
    } = command;
    const post = await em
      .findOneOrFail(Post, { where: { postId, boardType } })
      .catch(orThrowNotFoundPost);
    await em.remove(post);
    if (post.writerNickname)
      this.eventBus.publish(new PostDeletedByAdminEvent(post));
  }
}
