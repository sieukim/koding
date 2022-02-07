import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SavePostImageCommand } from "../save-post-image.command";
import { PostImageUploadResultDto } from "../../dto/post-image-upload-result.dto";
import { UploadService } from "../../upload.service";

@CommandHandler(SavePostImageCommand)
export class SavePostImageHandler
  implements ICommandHandler<SavePostImageCommand>
{
  constructor(private readonly uploadService: UploadService) {}

  async execute(
    command: SavePostImageCommand,
  ): Promise<PostImageUploadResultDto> {
    const { file, uploaderNickname } = command;
    const s3FileUrl = await this.uploadService.saveTemporaryPostImageFile(
      file,
      uploaderNickname,
    );
    return new PostImageUploadResultDto(s3FileUrl);
  }
}
