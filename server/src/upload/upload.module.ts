import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { MulterConfigService } from "./multer-config.service";
import { UploadController } from "./upload.controller";
import { CqrsModule } from "@nestjs/cqrs";
import { UploadCommandHandlers } from "./commands/handlers";
import { MongooseModule } from "@nestjs/mongoose";
import {
  TemporaryUploadedFile,
  TemporaryUploadedFileSchema,
} from "../schemas/temporary-uploaded-file.schema";
import { UploadService } from "./upload.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TemporaryUploadedFile.name, schema: TemporaryUploadedFileSchema },
    ]),
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
    CqrsModule,
  ],
  providers: [UploadService, MulterConfigService, ...UploadCommandHandlers],
  controllers: [UploadController],
})
export class UploadModule {}
