import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { getCurrentTime } from "../../common/utils/time.util";
import { S3Service } from "./s3.service";
import { EntityManager, In, MoreThan } from "typeorm";
import { InjectEntityManager } from "@nestjs/typeorm";
import { S3PostImage } from "../../entities/s3-post.image.entity";

@Injectable()
export class PostImageUploadService {
  private readonly logger = new Logger(PostImageUploadService.name);

  constructor(
    private readonly s3Service: S3Service,
    @InjectEntityManager() private readonly em: EntityManager,
  ) {}

  // @Cron(CronExpression.EVERY_10_SECONDS)
  @Cron(CronExpression.EVERY_HOUR)
  async deleteUnusedTemporaryFile() {
    return this.em.transaction(async (em) => {
      const deadline = getCurrentTime();
      deadline.setHours(deadline.getHours() - S3PostImage.EXPIRE_HOUR);
      // deadline.setSeconds(deadline.getSeconds() - 10);
      const files = await em.find(S3PostImage, {
        where: { createdAt: MoreThan(deadline), postId: null },
      });
      await this.s3Service
        .deletePostImageFiles(files.map((file) => file.s3FileKey))
        .catch((err) =>
          this.logger.error(
            `error while removing s3 images : ${err.toString?.() ?? err}`,
          ),
        );
      await em.remove(files);
      this.logger.log(
        `unused(during ${S3PostImage.EXPIRE_HOUR} hour) temporary files deleted`,
      );
    });
  }

  async saveTemporaryPostImageFile(
    file: Express.MulterS3.File,
    uploaderNickname: string,
  ) {
    const temporaryFile = new S3PostImage({
      uploaderNickname,
      s3FileUrl: file.location,
      s3FileKey: file.key,
    });
    await this.em.save(temporaryFile, { reload: false });
    return temporaryFile.s3FileUrl;
  }

  async setOwnerPostOfImages(postId: string, fileUrls: string[]) {
    await this.em.update(S3PostImage, { s3FileUrl: In(fileUrls) }, { postId });
    return;
  }

  async removePostImages(fileUrls: string[]) {
    return this.em.transaction(async (em) => {
      const files = await em.find(S3PostImage, {
        where: { s3FileUrl: In(fileUrls) },
      });
      await this.s3Service.deletePostImageFiles(
        files.map((file) => file.s3FileKey),
      );
      await em.remove(files);
    });
  }

  async validateImageUrls(imageUrls: string[], requestUserNickname: string) {
    if (!(await this.checkExistenceOfPostImages(imageUrls)))
      throw new BadRequestException("만료되거나 잘못된 이미지 URL이 있습니다.");
    if (!(await this.checkUploaderOfPostImages(imageUrls, requestUserNickname)))
      throw new ForbiddenException("이미지 업로더와 게시글 작성자가 다릅니다");
  }

  private async checkUploaderOfPostImages(
    fileUrls: string[],
    uploaderNickname: string,
  ) {
    const fileCount = await this.em.count(S3PostImage, {
      where: { s3FileUrl: In(fileUrls), uploaderNickname },
    });
    return fileUrls.length === fileCount;
  }

  private async checkExistenceOfPostImages(fileUrls: string[]) {
    const fileCount = await this.em.count(S3PostImage, {
      where: { s3FileUrl: In(fileUrls) },
    });
    return fileUrls.length === fileCount;
  }
}
