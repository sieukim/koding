import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { S3Image } from "../schemas/s3-image.schema";
import { Model } from "mongoose";

@Injectable()
export class UploadRepository {
  constructor(
    @InjectModel(S3Image.name)
    private readonly imageModel: Model<S3Image>,
  ) {}

  getTemporaryImages(imageUrls: string[]) {
    return this.imageModel
      .find({
        s3FileUrl: { $in: imageUrls },
      })
      .exec();
  }
}
