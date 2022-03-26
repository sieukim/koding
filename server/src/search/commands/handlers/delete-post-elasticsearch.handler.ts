import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeletePostElasticsearchCommand } from "../delete-post-elasticsearch.command";
import { PostSearchService } from "../../services/post-search.service";

@CommandHandler(DeletePostElasticsearchCommand)
export class DeletePostElasticsearchHandler
  implements ICommandHandler<DeletePostElasticsearchCommand>
{
  constructor(private readonly postSearchService: PostSearchService) {}

  async execute(command: DeletePostElasticsearchCommand) {
    const { postIdentifier } = command;
    await this.postSearchService.deleteById(postIdentifier);
  }
}
