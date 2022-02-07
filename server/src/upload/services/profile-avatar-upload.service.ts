import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { S3Service } from "./s3.service";
import { S3ProfileAvatarDocument } from "../../schemas/s3-profile-avatar.schema";
import { Cron, CronExpression } from "@nestjs/schedule";
import { getCurrentTime } from "../../common/utils/time.util";

@Injectable()
export class ProfileAvatarUploadService {
  private readonly logger = new Logger(ProfileAvatarUploadService.name);

  constructor(
    private readonly s3Service: S3Service,
    @InjectModel(S3ProfileAvatarDocument.name)
    private readonly profileAvatarModel: Model<S3ProfileAvatarDocument>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteUnusedTemporaryFile() {
    const deadline = getCurrentTime();
    deadline.setHours(
      deadline.getHours() - S3ProfileAvatarDocument.EXPIRE_HOUR,
    );
    const files = await this.profileAvatarModel
      .find({
        createdAt: { $gte: deadline },
        nickname: null,
      })
      .exec();
    await this.s3Service
      .deleteProfileAvatarFiles(files.map((file) => file.s3FileKey))
      .catch((err) =>
        this.logger.error(
          `error while removing s3 profile avatar : ${err.toString?.() ?? err}`,
        ),
      );
    await this.profileAvatarModel
      .deleteMany({
        _id: { $in: files.map((file) => file._id) },
      })
      .exec();
    this.logger.log(
      `unused(during ${S3ProfileAvatarDocument.EXPIRE_HOUR} hour) temporary profile avatar files deleted from AWS S3`,
    );
  }

  async saveTemporaryProfileAvatarInfo(file: Express.MulterS3.File) {
    const profileAvatar = await this.profileAvatarModel.create({
      nickname: null,
      s3FileUrl: file.location,
      s3FileKey: file.key,
    });
    return profileAvatar.s3FileUrl;
  }

  async setOwnerOfProfileAvatarInfo(fileUrl: string, nickname: string) {
    await this.profileAvatarModel.updateOne(
      { s3FileUrl: fileUrl },
      {
        nickname,
      },
    );
    return;
  }

  async removeProfileAvatarInfo(fileUrl: string) {
    const file = await this.profileAvatarModel
      .findOneAndRemove({
        s3FileUrl: fileUrl,
      })
      .exec();
    if (!file) return;
    await this.s3Service
      .deleteProfileAvatarFiles([file.s3FileKey])
      .catch((err) => this.logger.error(err));
    return;
  }
}
