import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteCommentCommand } from "../delete-comment.command";
import { UsersRepository } from "../../../users/users.repository";
import { PostsRepository } from "../../../posts/posts.repository";
import { CommentsRepository } from "../../comments.repository";
import { BadRequestException, NotFoundException } from "@nestjs/common";

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentHandler
  implements ICommandHandler<DeleteCommentCommand>
{
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly postRepository: PostsRepository,
    private readonly commentRepository: CommentsRepository,
  ) {}

  async execute(command: DeleteCommentCommand): Promise<void> {
    const { commentId, postIdentifier, requestUserNickname } = command;
    const [requestUser, post, comment] = await Promise.all([
      this.userRepository.findByNickname(requestUserNickname),
      this.postRepository.findByPostId(postIdentifier),
      this.commentRepository.findByCommentId(commentId),
    ]);
    if (!requestUser) throw new BadRequestException("잘못된 작성자입니다");
    if (!post) throw new NotFoundException("잘못된 게시글입니다");
    if (!comment) throw new NotFoundException("잘못된 댓글입니다");
    comment.verifyOwnerPost(post);
    comment.verifyOwner(requestUser);
    await this.commentRepository.remove(comment);
    return;
  }
}
