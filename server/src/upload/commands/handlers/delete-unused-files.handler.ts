import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteUnusedFilesCommand } from "../delete-unused-files.command";
import { InjectModel } from "@nestjs/mongoose";
import { S3Image } from "../../../schemas/s3-image.schema";
import { Model } from "mongoose";
import { currentTime } from "../../../common/utils/current-time.util";

@CommandHandler(DeleteUnusedFilesCommand)
export class DeleteUnusedFilesHandler
  implements ICommandHandler<DeleteUnusedFilesCommand, void>
{
  constructor(
    @InjectModel(S3Image.name)
    private readonly fileModel: Model<S3Image>,
  ) {}

  async execute(command: DeleteUnusedFilesCommand): Promise<void> {
    const deadline = currentTime();
    deadline.setHours(deadline.getHours() - S3Image.EXPIRE_HOUR);
    await this.fileModel.deleteMany({
      createdAt: { $gte: deadline },
      postId: null,
    });
  }
}
