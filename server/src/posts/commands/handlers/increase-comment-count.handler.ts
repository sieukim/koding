import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import {
  IncreaseCommentCountCommand,
  IncreaseType,
} from "../increase-comment-count.command";
import { PostCommentCountService } from "../../services/post-comment-count.service";

@CommandHandler(IncreaseCommentCountCommand)
export class IncreaseCommentCountHandler
  implements ICommandHandler<IncreaseCommentCountCommand>
{
  constructor(
    private readonly postCommentCountService: PostCommentCountService,
  ) {}

  async execute(command: IncreaseCommentCountCommand): Promise<any> {
    const { postIdentifier, type } = command;
    if (type === IncreaseType.Positive)
      return this.postCommentCountService.increaseCommentCount(postIdentifier);
    else
      return this.postCommentCountService.decreaseCommentCount(postIdentifier);
  }
}
