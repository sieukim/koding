import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { LikePostCommand } from "../like-post.command";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { PostLike } from "../../../entities/post-like.entity";
import { Post } from "../../../entities/post.entity";
import { orThrowNotFoundPost } from "../../../common/utils/or-throw";
import { PostLikedEvent } from "../../events/post-liked.event";
import { getCurrentTime } from "../../../common/utils/time.util";

@CommandHandler(LikePostCommand)
export class LikePostHandler implements ICommandHandler<LikePostCommand, void> {
  constructor(private readonly eventBus: EventBus) {}

  @Transaction()
  async execute(
    command: LikePostCommand,
    @TransactionManager() tm?: EntityManager,
  ): Promise<void> {
    const em = tm!;
    const {
      postIdentifier: { postId, boardType },
      nickname,
    } = command;
    let postLike = await em.findOne(PostLike, {
      where: { postId, nickname },
    });
    if (!postLike) {
      const post = await em
        .findOneOrFail(Post, { where: { postId, boardType } })
        .catch(orThrowNotFoundPost);
      postLike = new PostLike({ postId, boardType, nickname });
      post.likeCount++;
      await em.save([postLike, post], { reload: false });
      this.eventBus.publish(
        new PostLikedEvent({ postId, boardType }, nickname, getCurrentTime()),
      );
    }
    return;
  }
}
