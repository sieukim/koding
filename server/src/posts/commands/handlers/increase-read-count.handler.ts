import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { IncreaseReadCountCommand } from "../increase-read-count.command";
import { PostsRepository } from "../../posts.repository";

@CommandHandler(IncreaseReadCountCommand)
export class IncreaseReadCountHandler
  implements ICommandHandler<IncreaseReadCountCommand>
{
  constructor(private readonly postRepository: PostsRepository) {}

  async execute(command: IncreaseReadCountCommand) {
    const { postIdentifier } = command;
    await this.postRepository.increaseReadCount(postIdentifier);
    return;
  }
}
