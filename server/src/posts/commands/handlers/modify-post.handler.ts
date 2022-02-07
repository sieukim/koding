import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { ModifyPostCommand } from "../modify-post.command";
import { Post } from "../../../models/post.model";
import { PostsRepository } from "../../posts.repository";
import { UsersRepository } from "../../../users/users.repository";
import { NotFoundException } from "@nestjs/common";
import { UploadService } from "../../../upload/upload.service";

@CommandHandler(ModifyPostCommand)
export class ModifyPostHandler implements ICommandHandler<ModifyPostCommand> {
  constructor(
    private readonly postRepository: PostsRepository,
    private readonly userRepository: UsersRepository,
    private readonly uploadService: UploadService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: ModifyPostCommand): Promise<Post> {
    const { postIdentifier, modifyPostRequest, requestUserNickname } = command;
    const requestUser = await this.userRepository.findOne({
      nickname: { eq: requestUserNickname },
    });
    let post = await this.postRepository.findByPostId(postIdentifier);
    if (!post) throw new NotFoundException("잘못된 게시글입니다");
    if (modifyPostRequest.imageUrls)
      await this.uploadService.validateImageUrls(
        modifyPostRequest.imageUrls,
        requestUserNickname,
      );
    post = this.publisher.mergeObjectContext(post);
    post.modifyPost(requestUser, modifyPostRequest);
    const result = await this.postRepository.update(post);
    post.commit();
    return result;
  }
}
