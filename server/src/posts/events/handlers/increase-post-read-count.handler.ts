import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { IncreasePostReadCountEvent } from "../increase-post-read-count.event";
import { PostsRepository } from "../../posts.repository";

@EventsHandler(IncreasePostReadCountEvent)
export class IncreasePostReadCountHandler
  implements IEventHandler<IncreasePostReadCountEvent>
{
  constructor(private readonly postRepository: PostsRepository) {}

  async handle(event: IncreasePostReadCountEvent) {
    const { postIdentifier } = event;
    await this.postRepository.increaseReadCount(postIdentifier);
    return;
  }
}
