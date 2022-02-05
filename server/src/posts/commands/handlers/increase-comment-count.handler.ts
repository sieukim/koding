import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import {
  IncreaseCommentCountCommand,
  IncreaseType,
} from "../increase-comment-count.command";
import { PostsRepository } from "../../posts.repository";

@CommandHandler(IncreaseCommentCountCommand)
export class IncreaseCommentCountHandler
  implements ICommandHandler<IncreaseCommentCountCommand>
{
  constructor(private readonly postsRepository: PostsRepository) {}

  async execute(command: IncreaseCommentCountCommand): Promise<any> {
    const { postIdentifier, type } = command;
    if (type === IncreaseType.Positive)
      return this.postsRepository.increaseCommentCount(postIdentifier);
    else return this.postsRepository.decreaseCommentCount(postIdentifier);
  }
}
