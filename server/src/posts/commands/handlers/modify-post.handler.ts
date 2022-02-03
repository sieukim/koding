import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { ModifyPostCommand } from "../modify-post.command";
import { Post } from "../../../models/post.model";
import { PostsRepository } from "../../posts.repository";
import { UsersRepository } from "../../../users/users.repository";
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { UploadRepository } from "../../../upload/upload.repository";

@CommandHandler(ModifyPostCommand)
export class ModifyPostHandler implements ICommandHandler<ModifyPostCommand> {
  constructor(
    private readonly postRepository: PostsRepository,
    private readonly userRepository: UsersRepository,
    private readonly uploadRepository: UploadRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: ModifyPostCommand): Promise<Post> {
    const { postIdentifier, modifyPostRequest, requestUserNickname } = command;
    const requestUser = await this.userRepository.findOne({
      nickname: { eq: requestUserNickname },
    });
    let post = await this.postRepository.findByPostId(postIdentifier);
    if (!post) throw new NotFoundException("잘못된 게시글입니다");
    const images = await this.uploadRepository.getTemporaryImages(
      modifyPostRequest.imageUrls,
    );
    images.forEach(({ uploaderNickname }) => {
      if (uploaderNickname !== requestUserNickname)
        throw new ForbiddenException(
          "이미지 업로더와 게시글 작성자가 다릅니다",
        );
    });
    if (images.length !== (modifyPostRequest.imageUrls?.length ?? 0))
      throw new BadRequestException("만료되거나 잘못된 이미지 URL이 있습니다.");
    post = this.publisher.mergeObjectContext(post);
    post.modifyPost(requestUser, modifyPostRequest);
    post.commit();
    const result = await this.postRepository.update(post);
    post.commit();
    return result;
  }
}
