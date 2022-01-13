import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ModifyPostCommand } from "../modify-post.command";
import { Post } from "../../../models/post.model";
import { PostsRepository } from "../../posts.repository";
import { UsersRepository } from "../../../users/users.repository";

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
    post.modifyPost(requestUser, modifyPostRequest);
    await this.postRepository.update(post);
    return post;
  }
}
