import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { S3PostImageDocument } from "../schemas/s3-post-image.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { getCurrentTime } from "../common/utils/time.util";
import { S3Service } from "./s3.service";

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor(
    private readonly s3Service: S3Service,
    @InjectModel(S3PostImageDocument.name)
    private readonly postImageModel: Model<S3PostImageDocument>,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async deleteUnusedTemporaryFile() {
    const deadline = getCurrentTime();
    // deadline.setHours(deadline.getHours() - S3PostImageDocument.EXPIRE_HOUR);
    deadline.setSeconds(deadline.getSeconds() - 20);
    const files = await this.postImageModel
      .find({
        createdAt: { $gte: deadline },
        postId: null,
      })
      .exec();
    await this.s3Service
      .deleteS3PostImageFiles(files.map((file) => file.s3FileKey))
      .catch((err) =>
        this.logger.error(
          `error while removing s3 images : ${err.toString?.() ?? err}`,
        ),
      );
    await this.postImageModel
      .deleteMany({
        _id: { $in: files.map((file) => file._id) },
      })
      .exec();
    this.logger.log(
      `unused(during ${S3PostImageDocument.EXPIRE_HOUR} hour) temporary files deleted`,
    );
  }

  async saveTemporaryPostImageFile(
    file: Express.MulterS3.File,
    uploaderNickname: string,
  ) {
    const temporaryFile = await this.postImageModel.create({
      uploaderNickname,
      s3FileUrl: file.location,
      s3FileKey: file.key,
      postId: null,
    });
    return temporaryFile.s3FileUrl;
  }

  async setOwnerPostOfImages(postId: string, fileUrls: string[]) {
    await this.postImageModel
      .updateMany(
        {
          s3FileUrl: { $in: fileUrls },
        },
        { $set: { postId } },
      )
      .exec();
    return;
  }

  async removeOwnerPostOfImages(fileUrls: string[]) {
    const files = await this.postImageModel
      .find({
        s3FileUrl: { $in: fileUrls },
      })
      .exec();
    await this.s3Service.deleteS3PostImageFiles(
      files.map((file) => file.s3FileKey),
    );
    await this.postImageModel
      .deleteMany({ _id: { $in: files.map((file) => file._id) } })
      .exec();
    return;
  }

  async validateImageUrls(imageUrls: string[], requestUserNickname: string) {
    if (!(await this.checkExistenceOfPostImages(imageUrls)))
      throw new BadRequestException("만료되거나 잘못된 이미지 URL이 있습니다.");
    if (!(await this.checkUploaderOfPostImages(imageUrls, requestUserNickname)))
      throw new ForbiddenException("이미지 업로더와 게시글 작성자가 다릅니다");
  }

  private async checkUploaderOfPostImages(
    fileUrls: string[],
    uploaderNickname: string,
  ) {
    const fileCount = await this.postImageModel
      .count({
        s3FileUrl: { $in: fileUrls },
        uploaderNickname,
      })
      .exec();
    return fileUrls.length === fileCount;
  }

  private async checkExistenceOfPostImages(fileUrls: string[]) {
    const fileCount = await this.postImageModel
      .count({
        s3FileUrl: { $in: fileUrls },
      })
      .exec();
    return fileUrls.length === fileCount;
  }
}
