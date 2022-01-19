import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { TagChangedEvent } from "../tag-changed.event";
import { TagsRepository } from "../../tags.repository";
import { Logger } from "@nestjs/common";

@EventsHandler(TagChangedEvent)
export class TagChangedHandler implements IEventHandler<TagChangedEvent> {
  private readonly logger = new Logger(TagChangedHandler.name);

  constructor(private readonly tagsRepository: TagsRepository) {}

  async handle(event: TagChangedEvent): Promise<any> {
    const { changedTags = [], prevTags = [], boardType } = event;
    this.logger.log(`prevTags: ${prevTags}, changedTags: ${changedTags}`);
    const prevTagSet = new Set(prevTags);
    const changedTagSet = new Set(changedTags);
    const addedTags = changedTags.filter((tag) => !prevTagSet.has(tag));
    const removedTags = prevTags.filter((tag) => !changedTagSet.has(tag));
    this.logger.log(`increase ref count:${addedTags}`);
    this.logger.log(`decrease ref count:${removedTags}`);
    await Promise.all([
      this.tagsRepository.increaseRefCount(boardType, addedTags),
      this.tagsRepository.decreaseRefCount(boardType, removedTags),
    ]);
  }
}
