import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { UploadController } from "./upload.controller";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";
import {
  S3PostImageDocument,
  S3PostImageSchema,
} from "../schemas/s3-post-image.schema";
import { UploadEventHandlers } from "./event/handlers";
import {
  S3ProfileAvatarDocument,
  S3ProfileAvatarSchema,
} from "../schemas/s3-profile-avatar.schema";
import { UploadServices } from "./services";

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
  providers: [...UploadServices, ...UploadEventHandlers],
  controllers: [UploadController],
  exports: [...UploadServices],
})
export class UploadModule {}
