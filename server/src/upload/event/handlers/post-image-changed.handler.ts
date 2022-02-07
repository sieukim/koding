import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { PostImageChangedEvent } from "../post-image-changed.event";
import { UploadService } from "../../upload.service";

@EventsHandler(PostImageChangedEvent)
export class PostImageChangedHandler
  implements IEventHandler<PostImageChangedEvent>
{
  constructor(private readonly uploadService: UploadService) {}

  async handle(event: PostImageChangedEvent): Promise<any> {
    const { postId, changedImageUrls = [], prevImageUrls = [] } = event;
    const prevImageSet = new Set(prevImageUrls);
    const changedImageSet = new Set(changedImageUrls);
    const addedImages = changedImageUrls.filter(
      (url) => !prevImageSet.has(url),
    );
    const removedImages = prevImageUrls.filter(
      (url) => !changedImageSet.has(url),
    );
    await Promise.all([
      this.uploadService.setOwnerPostOfImages(postId, addedImages),
      this.uploadService.removeOwnerPostOfImages(removedImages),
    ]);
  }
}
