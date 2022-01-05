import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("UPLOAD")
@Controller("api/upload")
export class UploadController {
  @UseInterceptors(FileInterceptor("file"))
  @Post()
  async saveFile(@UploadedFile() file: Express.MulterS3.File) {
    console.log(file);
    return file.location;
  }
}
