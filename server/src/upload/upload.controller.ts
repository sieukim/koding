import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { CommandBus } from "@nestjs/cqrs";
import { SavePostImageCommand } from "./commands/save-post-image.command";
import { SavePostImageHandler } from "./commands/handlers/save-post-image.handler";
import { LoginUser } from "../common/decorator/login-user.decorator";
import { VerifiedUserGuard } from "../auth/guard/authorization/verified-user.guard";
import { User } from "../models/user.model";
import { PostImageUploadResultDto } from "./dto/post-image-upload-result.dto";
import { PostImageUploadRequestDto } from "./dto/post-image-upload-request.dto";

@ApiTags("UPLOAD")
@Controller("api/upload")
export class UploadController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({
    summary: "게시글의 이미지 업로드",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: PostImageUploadRequestDto })
  @ApiCreatedResponse({
    description: "이미지 업로드 성공",
    type: PostImageUploadResultDto,
  })
  @UseInterceptors(FileInterceptor("image"))
  @UseGuards(VerifiedUserGuard)
  @Post("/posts")
  saveFile(
    @UploadedFile() file: Express.MulterS3.File,
    @LoginUser() user: User,
  ) {
    console.log(file);
    return this.commandBus.execute(
      new SavePostImageCommand(user.nickname, file.location, file.key),
    ) as ReturnType<SavePostImageHandler["execute"]>;
  }
}
