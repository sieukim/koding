import { PostIdentifier } from "../../entities/post.entity";
import { Event } from "../../common/utils/event";

@Event()
export class PostModifiedEvent {
  constructor(public readonly postIdentifier: PostIdentifier) {}
}
