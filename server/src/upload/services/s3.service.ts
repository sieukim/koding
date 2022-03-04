import { Injectable, Logger } from "@nestjs/common";
import { S3 } from "aws-sdk";
import { ConfigService } from "@nestjs/config";
import { isString } from "class-validator";
import { KodingConfig } from "../../config/configutation";

@Injectable()
export class S3Service {
  public readonly s3: S3;
  public readonly bucketName: string;
  public readonly postImageKeyPrefix: string;
  public readonly profileAvatarKeyPrefix: string;
  private readonly logger = new Logger(S3Service.name);

  constructor(configService: ConfigService<KodingConfig, true>) {
    this.s3 = new S3({
      credentials: {
        accessKeyId: configService.get("aws.s3.aws-key", { infer: true }),
        secretAccessKey: configService.get("aws.s3.aws-secret", {
          infer: true,
        }),
        expired: false,
      },
      region: configService.get("aws.s3.region", { infer: true }),
    });
    this.bucketName = configService.get("aws.s3.bucket", { infer: true });
    this.postImageKeyPrefix = configService.get(
      "aws.s3.key-prefix.post-image",
      { infer: true },
    );
    this.profileAvatarKeyPrefix = configService.get(
      "aws.s3.key-prefix.profile-avatar",
      { infer: true },
    );
  }

  async deletePostImageFiles(fileKeys: string[]) {
    return new Promise<string[]>((res, rej) => {
      if (fileKeys.length <= 0) res([]);
      else {
        const deleteParams = {
          Bucket: this.bucketName,
          Delete: {
            Quiet: false,
            Objects: fileKeys.map((fileKey) => ({
              Key: `${this.postImageKeyPrefix}/${fileKey}`,
            })),
          },
        };
        this.s3.deleteObjects(deleteParams, (err, data) => {
          if (data)
            this.logger.log(
              `${
                data?.Deleted?.length
              } Image deleted from AWS S3, ${JSON.stringify(data.Deleted)}`,
            );
          if (err) rej(err);
          else if (data)
            res((data.Deleted ?? []).map(({ Key }) => Key).filter(isString));
        });
      }
    });
  }

  async deleteProfileAvatarFiles(fileKeys: string[]) {
    return new Promise<string[]>((res, rej) => {
      if (fileKeys.length <= 0) res([]);
      else {
        const deleteParams = {
          Bucket: this.bucketName,
          Delete: {
            Quiet: false,
            Objects: fileKeys.map((fileKey) => ({
              Key: `${this.profileAvatarKeyPrefix}/${fileKey}`,
            })),
          },
        };
        this.s3.deleteObjects(deleteParams, (err, data) => {
          if (data)
            this.logger.log(
              `${
                data.Deleted?.length
              } Avatar deleted from AWS S3, ${JSON.stringify(data.Deleted)}`,
            );
          if (err) rej(err);
          else
            res((data?.Deleted ?? []).map(({ Key }) => Key).filter(isString));
        });
      }
    });
  }
}
