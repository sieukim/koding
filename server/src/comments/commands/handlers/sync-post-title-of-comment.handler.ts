import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SyncPostTitleOfCommentCommand } from "../sync-post-title-of-comment.command";
import { CommentsRepository } from "../../comments.repository";
import { PostsRepository } from "../../../posts/posts.repository";

@CommandHandler(SyncPostTitleOfCommentCommand)
export class SyncPostTitleOfCommentHandler
  implements ICommandHandler<SyncPostTitleOfCommentCommand>
{
  constructor(
    public readonly commentsRepository: CommentsRepository,
    public readonly postsRepository: PostsRepository,
  ) {}

  async execute(command: SyncPostTitleOfCommentCommand): Promise<any> {
    const { postIdentifier } = command;
    const post = await this.postsRepository.findByPostId(postIdentifier);
    if (!post) return;
    const { postId, boardType } = postIdentifier;
    await this.commentsRepository.updateAll(
      {
        postId: { eq: postId },
        boardType: { eq: boardType },
      },
      { postTitle: post.title },
    );
  }
}
