import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { UploadController } from "./upload.controller";
import { CqrsModule } from "@nestjs/cqrs";
import { UploadCommandHandlers } from "./commands/handlers";
import { MongooseModule } from "@nestjs/mongoose";
import {
  S3PostImageDocument,
  S3PostImageSchema,
} from "../schemas/s3-post-image.schema";
import { UploadService } from "./upload.service";
import { S3Service } from "./s3.service";
import { UploadEventHandlers } from "./event/handlers";
import {
  S3ProfileAvatarDocument,
  S3ProfileAvatarSchema,
} from "../schemas/s3-profile-avatar.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: S3PostImageDocument.name,
        schema: S3PostImageSchema,
      },
      {
        name: S3ProfileAvatarDocument.name,
        schema: S3ProfileAvatarSchema,
      },
    ]),
    MulterModule.register(),
    CqrsModule,
  ],
  providers: [
    S3Service,
    UploadService,
    ...UploadCommandHandlers,
    ...UploadEventHandlers,
  ],
  controllers: [UploadController],
  exports: [UploadService],
})
export class UploadModule {}
