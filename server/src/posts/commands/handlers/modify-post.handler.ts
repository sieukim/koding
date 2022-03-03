import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { ModifyPostCommand } from "../modify-post.command";
import { Post } from "../../../entities/post.entity";
import { PostImageUploadService } from "../../../upload/services/post-image-upload.service";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { User } from "../../../entities/user.entity";
import {
  orThrowNotFoundPost,
  orThrowNotFoundUser,
} from "src/common/utils/or-throw";

@CommandHandler(ModifyPostCommand)
export class ModifyPostHandler implements ICommandHandler<ModifyPostCommand> {
  constructor(
    private readonly uploadService: PostImageUploadService,
    private readonly publisher: EventPublisher,
  ) {}

  @Transaction()
  async execute(
    command: ModifyPostCommand,
    @TransactionManager() tm?: EntityManager,
  ): Promise<Post> {
    const em = tm!;
    const {
      postIdentifier: { postId, boardType },
      modifyPostRequest,
      requestUserNickname,
    } = command;
    const requestUser = await em
      .findOneOrFail(User, { where: { nickname: requestUserNickname } })
      .catch(orThrowNotFoundUser);
    const post = this.publisher.mergeObjectContext(
      await em
        .findOneOrFail(Post, { where: { postId, boardType } })
        .catch(orThrowNotFoundPost),
    );
    if (modifyPostRequest.imageUrls)
      await this.uploadService.validateImageUrls(
        modifyPostRequest.imageUrls,
        requestUserNickname,
      );
    post.modifyPost(requestUser, modifyPostRequest);
    await em.save(Post, post, { reload: false });
    post.commit();
    return post;
  }
}
