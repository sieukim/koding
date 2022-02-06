import { FileInterceptor } from "@nestjs/platform-express";
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { S3Service } from "../s3.service";
import * as multerS3 from "multer-s3";

@Injectable()
export class ProfileAvatarUploadInterceptor implements NestInterceptor {
  private readonly fileInterceptor: NestInterceptor;

  constructor(private readonly s3Service: S3Service) {
    const { profileAvatarKeyPrefix, bucketName, s3 } = s3Service;
    this.fileInterceptor = new (FileInterceptor("image", {
      storage: multerS3({
        s3,
        bucket: `${bucketName}/${profileAvatarKeyPrefix}`,
        contentType: multerS3.AUTO_CONTENT_TYPE,
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }))();
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    return this.fileInterceptor.intercept(context, next);
  }
}
