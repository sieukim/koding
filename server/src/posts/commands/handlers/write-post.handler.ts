import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { WritePostCommand } from "../write-post.command";
import { Post } from "../../../models/post.model";
import { PostsRepository } from "../../posts.repository";
import { TagChangedEvent } from "../../../tags/events/tag-changed.event";
import { UploadRepository } from "../../../upload/upload.repository";
import { BadRequestException, ForbiddenException } from "@nestjs/common";
import { PostImageChangedEvent } from "../../../upload/event/post-image-changed.event";

@CommandHandler(WritePostCommand)
export class WritePostHandler implements ICommandHandler<WritePostCommand> {
  constructor(
    private readonly postRepository: PostsRepository,
    public readonly uploadRepository: UploadRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: WritePostCommand) {
    const {
      boardType,
      writerNickname,
      writePostRequest: { markdownContent, tags, title, imageUrls },
    } = command;
    const images = await this.uploadRepository.getTemporaryImages(imageUrls);
    images.forEach(({ uploaderNickname }) => {
      if (uploaderNickname !== writerNickname)
        throw new ForbiddenException(
          "이미지 업로더와 게시글 작성자가 다릅니다",
        );
    });
    if (images.length !== imageUrls.length)
      throw new BadRequestException("만료되거나 잘못된 이미지 URL이 있습니다.");
    const post = new Post({
      writerNickname,
      boardType,
      tags,
      title,
      markdownContent,
      imageUrls,
    });
    const resultPost = await this.postRepository.persist(post);
    this.eventBus.publish(
      new PostImageChangedEvent(post.postId, [], imageUrls),
    );
    this.eventBus.publish(new TagChangedEvent(boardType, [], tags));
    return resultPost;
  }
}
