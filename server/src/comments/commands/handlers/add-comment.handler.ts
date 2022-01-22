import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { AddCommentCommand } from "../add-comment.command";
import { PostsRepository } from "../../../posts/posts.repository";
import { Comment } from "../../../models/comment.model";
import { UsersRepository } from "../../../users/users.repository";
import { CommentsRepository } from "../../comments.repository";
import { Logger, NotFoundException } from "@nestjs/common";
import { CommentAddedEvent } from "../../events/comment-added.event";

@CommandHandler(AddCommentCommand)
export class AddCommentHandler implements ICommandHandler<AddCommentCommand> {
  private readonly logger = new Logger(AddCommentHandler.name);

  constructor(
    private readonly postRepository: PostsRepository,
    private readonly userRepository: UsersRepository,
    private readonly commentRepository: CommentsRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: AddCommentCommand): Promise<Comment> {
    const { postIdentifier, addCommentRequest, writerNickname } = command;
    const { mentionedNicknames, content } = addCommentRequest;
    const writer = await this.userRepository.findByNickname(writerNickname);
    if (!writer) throw new NotFoundException("잘못된 작성자 입니다");
    const post = await this.postRepository.findByPostId(postIdentifier);
    if (!post) throw new NotFoundException("잘못된 게시글입니다");
    const mentionedUsers = await this.userRepository.findAll({
      nickname: { in: mentionedNicknames },
    });
    const comment = new Comment({
      postId: post.postId,
      writerNickname: writer.nickname,
      content,
      mentionedUsers,
    });
    this.logger.log(`before commentId: ${comment.commentId}`);
    const returned = await this.commentRepository.persist(comment);
    this.logger.log(`after commentId: ${returned.commentId}`);
    this.eventBus.publish(
      new CommentAddedEvent(
        postIdentifier,
        post.writer.nickname,
        comment.commentId,
        comment.writerNickname,
        comment.content,
        comment.mentionedUsers.map(({ nickname }) => nickname),
      ),
    );
    return returned;
  }
}
