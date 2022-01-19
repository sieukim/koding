import { Injectable } from "@nestjs/common";
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from "@nestjs/platform-express";
import * as multerS3 from "multer-s3";
import { S3Service } from "./s3.service";

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  constructor(private readonly s3Service: S3Service) {}

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: multerS3({
        s3: this.s3Service.getS3(),
        bucket: this.s3Service.getPostImageBucketName(),
        contentType: multerS3.AUTO_CONTENT_TYPE,
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    };
  }
}
