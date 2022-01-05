import { Injectable } from "@nestjs/common";
import { MulterModuleOptions, MulterOptionsFactory } from "@nestjs/platform-express";
import { ConfigService } from "@nestjs/config";
import { S3 } from "aws-sdk";
import * as multerS3 from "multer-s3";


@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  private readonly s3: S3;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3({
      credentials: {
        accessKeyId: configService.get<string>("aws.s3.aws-key"),
        secretAccessKey: configService.get<string>("aws.s3.aws-secret"),
        expired: false
      },
      region: configService.get<string>("aws.s3.region")
    });
  }

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: multerS3({
        s3: this.s3,
        bucket: this.configService.get<string>("aws.s3.bucket"),
        contentType: multerS3.AUTO_CONTENT_TYPE
      }),
      limits: { fileSize: 10 * 1024 * 1024 } // 10MB
    };
  }

}