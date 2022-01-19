import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { PostImageChangedEvent } from "../post-image-changed.event";
import { S3Image } from "../../../schemas/s3-image.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@EventsHandler(PostImageChangedEvent)
export class PostImageChangedHandler
  implements IEventHandler<PostImageChangedEvent>
{
  constructor(
    @InjectModel(S3Image.name)
    private readonly imageModel: Model<S3Image>,
  ) {}

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
      this.imageModel.updateMany(
        {
          s3FileUrl: { $in: removedImages },
        },
        { $set: { postId: null } },
      ),
      this.imageModel.updateMany(
        {
          s3FileUrl: { $in: addedImages },
        },
        {
          $set: { postId },
        },
      ),
    ]);
  }
}
