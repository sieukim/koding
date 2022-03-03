import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { UploadController } from "./upload.controller";
import { CqrsModule } from "@nestjs/cqrs";
import { UploadEventHandlers } from "./event/handlers";
import { UploadServices } from "./services";
import { TypeOrmModule } from "@nestjs/typeorm";
import { S3PostImage } from "../entities/s3-post.image.entity";
import { S3ProfileAvatar } from "../entities/s3-profile.avatar.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([S3PostImage, S3ProfileAvatar]),
    MulterModule.register(),
    CqrsModule,
  ],
  providers: [...UploadServices, ...UploadEventHandlers],
  controllers: [UploadController],
  exports: [...UploadServices],
})
export class UploadModule {}
