import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { ScrapPostCommand } from "../scrap-post.command";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { PostScrap } from "../../../entities/post-scrap.entity";
import { increaseField } from "../../../common/utils/increase-field";
import { Post } from "../../../entities/post.entity";
import { PostScrappedEvent } from "../../events/post-scrapped.event";
import { getCurrentTime } from "../../../common/utils/time.util";

@CommandHandler(ScrapPostCommand)
export class ScrapPostHandler implements ICommandHandler<ScrapPostCommand> {
  constructor(private readonly eventBus: EventBus) {}

  @Transaction()
  async execute(
    command: ScrapPostCommand,
    @TransactionManager() tm?: EntityManager,
  ) {
    const em = tm!;
    const {
      postIdentifier: { postId, boardType },
      nickname,
    } = command;
    let postScrap = await em.findOne(PostScrap, {
      where: { postId, nickname },
    });
    if (!postScrap) {
      postScrap = new PostScrap({ postId, boardType, nickname });
      await Promise.all([
        em.save(postScrap, { reload: false }),
        increaseField(em, Post, "scrapCount", 1, { postId, boardType }),
      ]);
      this.eventBus.publish(
        new PostScrappedEvent(
          { postId, boardType },
          nickname,
          getCurrentTime(),
        ),
      );
    }
    return;
  }
}
