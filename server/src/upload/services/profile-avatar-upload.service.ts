import { Injectable, Logger } from "@nestjs/common";
import { S3Service } from "./s3.service";
import { Cron, CronExpression } from "@nestjs/schedule";
import { getCurrentTime } from "../../common/utils/time.util";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager, MoreThan } from "typeorm";
import { S3ProfileAvatar } from "../../entities/s3-profile.avatar.entity";

@Injectable()
export class ProfileAvatarUploadService {
  private readonly logger = new Logger(ProfileAvatarUploadService.name);

  constructor(
    private readonly s3Service: S3Service,
    @InjectEntityManager() private readonly em: EntityManager,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteUnusedTemporaryFile() {
    return this.em.transaction(async (em) => {
      const deadline = getCurrentTime();
      deadline.setHours(deadline.getHours() - S3ProfileAvatar.EXPIRE_HOUR);
      const files = await em.find(S3ProfileAvatar, {
        where: { createdAt: MoreThan(deadline), uploaderNickname: null },
      });

      await this.s3Service
        .deleteProfileAvatarFiles(files.map((file) => file.s3FileKey))
        .catch((err) =>
          this.logger.error(
            `error while removing s3 profile avatar : ${
              err.toString?.() ?? err
            }`,
          ),
        );
      await em.remove(files);
      this.logger.log(
        `unused(during ${S3ProfileAvatar.EXPIRE_HOUR} hour) temporary profile avatar files deleted from AWS S3`,
      );
    });
  }

  async saveTemporaryProfileAvatarInfo(file: Express.MulterS3.File) {
    const profileAvatar = new S3ProfileAvatar({
      s3FileUrl: file.location,
      s3FileKey: file.key,
    });
    await this.em.save(profileAvatar, { reload: false });
    return profileAvatar.s3FileUrl;
  }

  async setOwnerOfProfileAvatarInfo(fileUrl: string, nickname: string) {
    await this.em.update(
      S3ProfileAvatar,
      { s3FileUrl: fileUrl },
      { uploaderNickname: nickname },
    );
    return;
  }

  async removeProfileAvatarInfo(fileUrl: string) {
    return this.em.transaction(async (em) => {
      const file = await em.findOne(S3ProfileAvatar, {
        where: { s3FileUrl: fileUrl },
      });
      if (!file) return;
      await this.s3Service
        .deleteProfileAvatarFiles([file.s3FileKey])
        .catch((err) => this.logger.error(err));
      await em.remove(file);
    });
  }
}
