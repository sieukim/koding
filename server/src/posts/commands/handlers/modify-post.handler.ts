import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ModifyPostCommand } from "../modify-post.command";
import { Post } from "../../../models/post.model";
import { PostsRepository } from "../../posts.repository";
import { UsersRepository } from "../../../users/users.repository";
import { NotFoundException } from "@nestjs/common";

@CommandHandler(ModifyPostCommand)
export class ModifyPostHandler implements ICommandHandler<ModifyPostCommand> {
  constructor(
    private readonly postRepository: PostsRepository,
    private readonly userRepository: UsersRepository,
  ) {}

  async execute(command: ModifyPostCommand): Promise<Post> {
    const { postIdentifier, modifyPostRequest, requestUserNickname } = command;
    const requestUser = await this.userRepository.findOne({
      nickname: { eq: requestUserNickname },
    });
    const post = await this.postRepository.findByPostId(postIdentifier);
    if (!post) throw new NotFoundException("잘못된 게시글입니다");
    post.modifyPost(requestUser, modifyPostRequest);
    await this.postRepository.update(post);
    return post;
  }
}
