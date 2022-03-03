import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { AddCommentCommand } from "../add-comment.command";
import { Comment } from "../../../entities/comment.entity";
import { CommentAddedEvent } from "../../events/comment-added.event";
import { EntityManager, In, Transaction, TransactionManager } from "typeorm";
import { User } from "../../../entities/user.entity";
import {
  orThrowNotFoundPost,
  orThrowNotFoundUser,
} from "src/common/utils/or-throw";
import { Post } from "../../../entities/post.entity";

@CommandHandler(AddCommentCommand)
export class AddCommentHandler implements ICommandHandler<AddCommentCommand> {
  constructor(private readonly eventBus: EventBus) {}

  @Transaction()
  async execute(
    command: AddCommentCommand,
    @TransactionManager() tm?: EntityManager,
  ): Promise<Comment> {
    const em = tm!;
    const {
      postIdentifier: { postId, boardType },
      addCommentRequest,
      writerNickname,
    } = command;
    const { mentionedNicknames, content } = addCommentRequest;
    const [writer, mentionedUsers] = await Promise.all([
      em
        .findOneOrFail(User, {
          where: { nickname: writerNickname },
          select: ["nickname"],
        })
        .catch(orThrowNotFoundUser),
      em.find(User, {
        where: { nickname: In(mentionedNicknames ?? []) },
        select: ["nickname"],
      }),
      em
        .findOneOrFail(Post, {
          where: { postId, boardType },
          select: ["postId"],
        })
        .catch(orThrowNotFoundPost),
    ]);
    const comment = new Comment({
      postIdentifier: { postId, boardType },
      writerNickname: writer.nickname,
      content,
      mentionedNicknames: mentionedUsers.map((user) => user.nickname),
    });
    await em.save(comment, { reload: false });
    this.eventBus.publish(
      new CommentAddedEvent(
        { postId, boardType },
        comment.commentId,
        comment.createdAt,
      ),
    );
    return comment;
  }
}
