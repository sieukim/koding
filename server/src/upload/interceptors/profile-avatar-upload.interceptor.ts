import { FileInterceptor } from "@nestjs/platform-express";
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { from, mergeAll, Observable } from "rxjs";
import { S3Service } from "../services/s3.service";
import * as multerS3 from "multer-s3";
import { ProfileAvatarUploadService } from "../services/profile-avatar-upload.service";
import { Request } from "express";

@Injectable()
export class ProfileAvatarUploadInterceptor implements NestInterceptor {
  private readonly fileInterceptor: NestInterceptor;

  constructor(
    private readonly s3Service: S3Service,
    private readonly profileAvatarUploadService: ProfileAvatarUploadService,
  ) {
    const { profileAvatarKeyPrefix, bucketName, s3 } = s3Service;
    this.fileInterceptor = new (FileInterceptor("avatar", {
      storage: multerS3({
        s3,
        bucket: `${bucketName}/${profileAvatarKeyPrefix}`,
        contentType: multerS3.AUTO_CONTENT_TYPE,
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }))();
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const callHandler: CallHandler = {
      handle: () => {
        return from(
          (async () => {
            const req = context.switchToHttp().getRequest<Request>();
            // 프로필 사진을 업로드하지 않은 경우엔 데이터베이스에 저장하지 않음
            if (req.file)
              await this.profileAvatarUploadService.saveTemporaryProfileAvatarInfo(
                req.file as Express.MulterS3.File,
              );
            return next.handle();
          })(),
        ).pipe(mergeAll());
      },
    };
    return this.fileInterceptor.intercept(context, callHandler);
    // return this.fileInterceptor.intercept(context, next);
  }
}
