import { PostIdentifier } from "../../models/post.model";

export class PostModifiedEvent {
  constructor(public readonly postIdentifier: PostIdentifier) {}
}
