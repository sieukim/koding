import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { WritePostCommand } from "../write-post.command";
import { Post } from "../../../models/post.model";
import { PostsRepository } from "../../posts.repository";
import { TagChangedEvent } from "../../../tags/events/tag-changed.event";
import { PostImageChangedEvent } from "../../../upload/event/post-image-changed.event";
import { UploadService } from "../../../upload/upload.service";

@CommandHandler(WritePostCommand)
export class WritePostHandler implements ICommandHandler<WritePostCommand> {
  constructor(
    private readonly postRepository: PostsRepository,
    private readonly uploadService: UploadService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: WritePostCommand) {
    const {
      boardType,
      writerNickname,
      writePostRequest: {
        markdownContent,
        tags,
        title,
        imageUrls,
        htmlContent,
      },
    } = command;
    await this.uploadService.validateImageUrls(imageUrls, writerNickname);
    const post = new Post({
      writerNickname,
      boardType,
      tags,
      title,
      markdownContent,
      htmlContent,
      imageUrls,
    });
    const resultPost = await this.postRepository.persist(post);
    this.eventBus.publishAll([
      new PostImageChangedEvent(post.postId, [], imageUrls),
      new TagChangedEvent(boardType, [], tags),
    ]);
    return resultPost;
  }
}
