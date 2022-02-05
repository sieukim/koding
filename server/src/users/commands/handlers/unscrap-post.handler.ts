import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UnscrapPostCommand } from "../unscrap-post.command";
import { PostScrapService } from "../../services/post-scrap.service";

@CommandHandler(UnscrapPostCommand)
export class UnscrapPostHandler implements ICommandHandler<UnscrapPostCommand> {
  constructor(private readonly postScrapService: PostScrapService) {}

  async execute(command: UnscrapPostCommand) {
    const { postIdentifier, nickname } = command;
    await this.postScrapService.unscrapPost(postIdentifier, nickname);
    return;
  }
}
