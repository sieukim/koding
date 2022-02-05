import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ScrapPostCommand } from "../scrap-post.command";
import { PostScrapService } from "../../services/post-scrap.service";

@CommandHandler(ScrapPostCommand)
export class ScrapPostHandler implements ICommandHandler<ScrapPostCommand> {
  constructor(private readonly postScrapService: PostScrapService) {}

  async execute(command: ScrapPostCommand) {
    const { postIdentifier, nickname } = command;
    await this.postScrapService.scrapPost(postIdentifier, nickname);
    return;
  }
}
