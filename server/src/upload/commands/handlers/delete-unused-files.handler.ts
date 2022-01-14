import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteUnusedFilesCommand } from "../delete-unused-files.command";
import { InjectModel } from "@nestjs/mongoose";
import { TemporaryUploadedFile } from "../../../schemas/temporary-uploaded-file.schema";
import { Model } from "mongoose";
import { currentTime } from "../../../common/utils/current-time.util";

@CommandHandler(DeleteUnusedFilesCommand)
export class DeleteUnusedFilesHandler
  implements ICommandHandler<DeleteUnusedFilesCommand, void>
{
  constructor(
    @InjectModel(TemporaryUploadedFile.name)
    private readonly fileModel: Model<TemporaryUploadedFile>,
  ) {}

  async execute(command: DeleteUnusedFilesCommand): Promise<void> {
    const deadline = currentTime();
    deadline.setHours(deadline.getHours() - TemporaryUploadedFile.EXPIRE_HOUR);
    await this.fileModel.deleteMany({ createdAt: { $gte: deadline } });
  }
}
