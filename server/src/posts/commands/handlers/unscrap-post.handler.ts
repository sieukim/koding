import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { UnscrapPostCommand } from "../unscrap-post.command";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { PostScrap } from "../../../entities/post-scrap.entity";
import { increaseField } from "../../../common/utils/increase-field";
import { Post } from "../../../entities/post.entity";
import { PostUnscrappedEvent } from "../../events/post-unscrapped.event";

@CommandHandler(UnscrapPostCommand)
export class UnscrapPostHandler implements ICommandHandler<UnscrapPostCommand> {
  constructor(private readonly eventBus: EventBus) {}

  @Transaction()
  async execute(
    command: UnscrapPostCommand,
    @TransactionManager() tm?: EntityManager,
  ) {
    const em = tm!;
    const {
      postIdentifier: { postId, boardType },
      nickname,
    } = command;
    const postScrap = await em.findOne(PostScrap, {
      where: { postId, nickname },
    });
    if (postScrap) {
      await Promise.all([
        em.remove(postScrap),
        increaseField(em, Post, "scrapCount", -1, { postId, boardType }),
      ]);
      this.eventBus.publish(
        new PostUnscrappedEvent(
          { postId, boardType },
          nickname,
          postScrap.createdAt,
        ),
      );
    }
    return;
  }
}
