import { FileInterceptor } from "@nestjs/platform-express";
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { from, mergeAll, Observable } from "rxjs";
import { S3Service } from "../services/s3.service";
import * as multerS3 from "multer-s3";
import { PostImageUploadService } from "../services/post-image-upload.service";
import { Request } from "express";

@Injectable()
export class PostImageUploadInterceptor implements NestInterceptor {
  private readonly fileInterceptor: NestInterceptor;
  private readonly logger = new Logger(PostImageUploadInterceptor.name);

  constructor(
    private readonly s3Service: S3Service,
    private readonly postImageUploadService: PostImageUploadService,
  ) {
    const { postImageKeyPrefix, bucketName, s3 } = s3Service;
    this.fileInterceptor = new (FileInterceptor("image", {
      storage: multerS3({
        s3,
        bucket: `${bucketName}/${postImageKeyPrefix}`,
        contentType: multerS3.AUTO_CONTENT_TYPE,
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }))();
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const callHandler: CallHandler = {
      handle: () => {
        return from(
          (async () => {
            const req = context.switchToHttp().getRequest<Request>();
            const user = req.user;
            this.logger.log("file: " + JSON.stringify(req.file));
            if (user && req.file)
              await this.postImageUploadService.saveTemporaryPostImageFile(
                req.file as Express.MulterS3.File,
                user.nickname,
              );
            return next.handle();
          })(),
        ).pipe(mergeAll());
      },
    };

    return this.fileInterceptor.intercept(context, callHandler);
  }
}
