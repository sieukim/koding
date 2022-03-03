import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { WritePostCommand } from "../write-post.command";
import { Post } from "../../../entities/post.entity";
import { TagChangedEvent } from "../../../tags/events/tag-changed.event";
import { PostImageChangedEvent } from "../../../upload/event/post-image-changed.event";
import { PostImageUploadService } from "../../../upload/services/post-image-upload.service";
import { EntityManager, Transaction, TransactionManager } from "typeorm";

@CommandHandler(WritePostCommand)
export class WritePostHandler implements ICommandHandler<WritePostCommand> {
  constructor(
    private readonly uploadService: PostImageUploadService,
    private readonly eventBus: EventBus,
  ) {}

  @Transaction()
  async execute(
    command: WritePostCommand,
    @TransactionManager() tm?: EntityManager,
  ) {
    const em = tm!;
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
    await em.save(post, { reload: false });
    this.eventBus.publishAll([
      new PostImageChangedEvent(post.postId, [], imageUrls),
      new TagChangedEvent(boardType, [], tags),
    ]);
    return post;
  }
}
