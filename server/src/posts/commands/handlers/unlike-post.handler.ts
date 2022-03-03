import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { UnlikePostCommand } from "../unlike-post.command";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { PostLike } from "../../../entities/post-like.entity";
import { getCurrentDate, isSameDate } from "../../../common/utils/time.util";
import { PostUnlikedEvent } from "../../events/post-unliked.event";
import { Post } from "../../../entities/post.entity";
import { increaseField } from "../../../common/utils/increase-field";

@CommandHandler(UnlikePostCommand)
export class UnlikePostHandler
  implements ICommandHandler<UnlikePostCommand, void>
{
  constructor(private readonly eventBus: EventBus) {}

  @Transaction()
  async execute(
    command: UnlikePostCommand,
    @TransactionManager() tm?: EntityManager,
  ): Promise<void> {
    const em = tm!;
    const {
      postIdentifier: { postId, boardType },
      nickname,
    } = command;

    const postLike = await em.findOne(PostLike, {
      where: { postId, nickname },
    });
    if (postLike) {
      await em.remove(postLike);
      if (isSameDate(getCurrentDate(), postLike.createdAt))
        await increaseField(em, Post, "likeCount", -1, { postId });
      this.eventBus.publish(
        new PostUnlikedEvent(
          { postId, boardType },
          nickname,
          postLike.createdAt,
        ),
      );
    }
    return;
  }
}
