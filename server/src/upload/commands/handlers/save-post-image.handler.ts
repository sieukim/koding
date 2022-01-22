import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SavePostImageCommand } from "../save-post-image.command";
import { InjectModel } from "@nestjs/mongoose";
import { S3Image } from "src/schemas/s3-image.schema";
import { Model } from "mongoose";
import { PostImageUploadResultDto } from "../../dto/post-image-upload-result.dto";

@CommandHandler(SavePostImageCommand)
export class SavePostImageHandler
  implements ICommandHandler<SavePostImageCommand>
{
  constructor(
    @InjectModel(S3Image.name)
    private readonly fileModel: Model<S3Image>,
  ) {}

  async execute(
    command: SavePostImageCommand,
  ): Promise<PostImageUploadResultDto> {
    const { s3FileKey, s3FileUrl, uploaderNickname } = command;
    const file = new this.fileModel({ uploaderNickname, s3FileUrl, s3FileKey });
    await file.save();
    return new PostImageUploadResultDto(file.s3FileUrl);
  }
}
