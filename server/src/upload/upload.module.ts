import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { MulterConfigService } from "./multer-config.service";
import { UploadController } from "./upload.controller";


@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService
    })
  ],
  providers: [MulterConfigService],
  controllers: [UploadController]
})
export class UploadModule {
}
