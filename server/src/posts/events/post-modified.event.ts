import { PostIdentifier } from "../../models/post.model";
import { Event } from "../../common/utils/event";

@Event()
export class PostModifiedEvent {
  constructor(public readonly postIdentifier: PostIdentifier) {}
}
