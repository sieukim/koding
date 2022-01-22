import { Injectable, Logger } from "@nestjs/common";
import { S3 } from "aws-sdk";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class S3Service {
  private readonly s3: S3;
  private readonly postImageBucketName: string;
  private readonly logger = new Logger(S3Service.name);

  constructor(configService: ConfigService) {
    this.s3 = new S3({
      credentials: {
        accessKeyId: configService.get<string>("aws.s3.aws-key"),
        secretAccessKey: configService.get<string>("aws.s3.aws-secret"),
        expired: false,
      },
      region: configService.get<string>("aws.s3.region"),
    });
    this.postImageBucketName = configService.get<string>("aws.s3.bucket");
  }

  getPostImageBucketName(): string {
    return this.postImageBucketName;
  }

  getS3(): S3 {
    return this.s3;
  }

  async deleteS3PostImageFiles(fileKeys: string[]) {
    return new Promise<string[]>((res, rej) => {
      this.s3.deleteObjects(
        {
          Bucket: this.postImageBucketName,
          Delete: {
            Quiet: false,
            Objects: fileKeys.map((fileKey) => ({ Key: fileKey })),
          },
        },
        (err, data) => {
          if (data)
            this.logger.log(
              `${
                data.Deleted.length
              } Image deleted from AWS S3, ${data.Deleted.toString()}`,
            );
          if (err) rej(err);
          else res(data.Deleted.map(({ Key }) => Key));
        },
      );
    });
  }
}
