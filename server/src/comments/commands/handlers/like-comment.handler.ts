import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { LikeCommentCommand } from "../like-comment.command";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { CommentLike } from "../../../entities/comment-like.entity";
import { increaseField } from "../../../common/utils/increase-field";
import { Post } from "../../../entities/post.entity";
import { Comment } from "../../../entities/comment.entity";
import { orThrowNotFoundComment } from "../../../common/utils/or-throw";
import { CommentLikedEvent } from "../../events/comment-liked.event";
import { getCurrentTime } from "../../../common/utils/time.util";

@CommandHandler(LikeCommentCommand)
export class LikeCommentHandler implements ICommandHandler<LikeCommentCommand> {
  constructor(private readonly eventBus: EventBus) {}

  @Transaction()
  async execute(
    command: LikeCommentCommand,
    @TransactionManager() tm?: EntityManager,
  ) {
    const em = tm!;
    const {
      commentId,
      postIdentifier: { postId, boardType },
      nickname,
    } = command;
    const commentLike = await em.findOne(CommentLike, {
      where: { commentId, nickname },
    });
    if (!commentLike) {
      await Promise.all([
        em
          .findOneOrFail(Comment, {
            where: { commentId, boardType, postId },
            select: ["commentId"],
          })
          .catch(orThrowNotFoundComment),
        em.save(new CommentLike({ commentId, boardType, postId, nickname }), {
          reload: false,
        }),
        increaseField(em, Post, "likeCount", 1, { postId, boardType }),
      ]);
      this.eventBus.publish(
        new CommentLikedEvent(commentId, nickname, getCurrentTime()),
      );
    }
    return;
  }
}
