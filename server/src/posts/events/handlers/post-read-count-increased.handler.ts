import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { PostReadCountIncreasedEvent } from "../post-read-count-increased.event";
import { PostsRepository } from "../../posts.repository";

@EventsHandler(PostReadCountIncreasedEvent)
export class PostReadCountIncreasedHandler
  implements IEventHandler<PostReadCountIncreasedEvent>
{
  constructor(private readonly postRepository: PostsRepository) {}

  async handle(event: PostReadCountIncreasedEvent) {
    const { postIdentifier } = event;
    await this.postRepository.increaseReadCount(postIdentifier);
    return;
  }
}
