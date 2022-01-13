import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeletePostCommand } from "../delete-post.command";
import { PostsRepository } from "../../posts.repository";
import { UsersRepository } from "../../../users/users.repository";

@CommandHandler(DeletePostCommand)
export class DeletePostHandler implements ICommandHandler<DeletePostCommand> {
  constructor(
    private readonly postRepository: PostsRepository,
    private readonly userRepository: UsersRepository,
  ) {}

  async execute(command: DeletePostCommand): Promise<void> {
    const { postIdentifier, requestUserNickname } = command;
    const requestUser = await this.userRepository.findByNickname(
      requestUserNickname,
    );
    const post = await this.postRepository.findByPostId(postIdentifier);
    post.verifyOwner(requestUser);
    await this.postRepository.remove(post);
  }
}
