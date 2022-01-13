import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ModifyCommentCommand } from "../modify-comment.command";
import { Comment } from "../../../models/comment.model";
import { CommentsRepository } from "../../comments.repository";
import { PostsRepository } from "../../../posts/posts.repository";
import { UsersRepository } from "../../../users/users.repository";
import { Logger, NotFoundException } from "@nestjs/common";

@CommandHandler(ModifyCommentCommand)
export class ModifyCommentHandler
  implements ICommandHandler<ModifyCommentCommand>
{
  private readonly logger = new Logger(ModifyCommentHandler.name);

  constructor(
    private readonly commentRepository: CommentsRepository,
    private readonly postRepository: PostsRepository,
    private readonly userRepository: UsersRepository,
  ) {}

  async execute(command: ModifyCommentCommand): Promise<Comment> {
    const {
      postIdentifier,
      requestUserNickname,
      modifyCommentRequest,
      commentId,
    } = command;
    console.log(
      "postIdentifier: ",
      postIdentifier,
      ", requestUserNickname: ",
      requestUserNickname,
    );
    const [requestUser, post, comment, mentionedUser] = await Promise.all([
      this.userRepository.findByNickname(requestUserNickname),
      this.postRepository.findByPostId(postIdentifier),
      this.commentRepository.findByCommentId(commentId),
      this.userRepository.findAll({
        nickname: { in: modifyCommentRequest.mentionedNicknames ?? [] },
      }),
    ]);
    this.logger.log(`comment: ${comment.toString}`);
    if (!requestUser) throw new NotFoundException("잘못된 작성자입니다");
    if (!post) throw new NotFoundException("잘못된 게시글입니다");
    if (!comment) throw new NotFoundException("잘못된 댓글입니다");
    comment.verifyOwnerPost(post);
    comment.modifyComment(requestUser, {
      ...modifyCommentRequest,
      mentionedNicknames: mentionedUser.map(({ nickname }) => nickname),
    });
    return await this.commentRepository.update(comment);
  }
}
