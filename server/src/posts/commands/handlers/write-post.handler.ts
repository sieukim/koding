import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { WritePostCommand } from "../write-post.command";
import { Post } from "../../../models/post.model";
import { PartialUser } from "../../../models/user.model";
import { PostsRepository } from "../../posts.repository";

@CommandHandler(WritePostCommand)
export class WritePostHandler implements ICommandHandler<WritePostCommand> {
  constructor(private readonly postRepository: PostsRepository) {}

  async execute(command: WritePostCommand) {
    const {
      boardType,
      writerNickname,
      writePostRequest: { markdownContent, tags, title },
    } = command;
    const post = new Post({
      writer: new PartialUser({ nickname: writerNickname }),
      boardType,
      tags,
      title,
      markdownContent,
    });
    return await this.postRepository.persist(post);
  }
}
