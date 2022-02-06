import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteUnusedFilesCommand } from "../delete-unused-files.command";
import { InjectModel } from "@nestjs/mongoose";
import { S3Image } from "../../../schemas/s3-image.schema";
import { Model } from "mongoose";
import { getCurrentTime } from "../../../common/utils/time.util";
import { S3Service } from "../../s3.service";
import { Logger } from "@nestjs/common";

@CommandHandler(DeleteUnusedFilesCommand)
export class DeleteUnusedFilesHandler
  implements ICommandHandler<DeleteUnusedFilesCommand, void>
{
  private readonly logger = new Logger(DeleteUnusedFilesHandler.name);

  constructor(
    @InjectModel(S3Image.name)
    private readonly fileModel: Model<S3Image>,
    private readonly s3Service: S3Service,
  ) {}

  async execute(command: DeleteUnusedFilesCommand): Promise<void> {
    const deadline = getCurrentTime();
    deadline.setHours(deadline.getHours() - S3Image.EXPIRE_HOUR);
    // deadline.setSeconds(deadline.getSeconds() - 10);
    const files = await this.fileModel
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
    await this.fileModel.deleteMany({
      _id: { $in: files.map((file) => file._id) },
    });
  }
}
