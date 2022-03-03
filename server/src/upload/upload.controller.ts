import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { PostImageUploadResultDto } from "./dto/post-image-upload-result.dto";
import { PostImageUploadRequestDto } from "./dto/post-image-upload-request.dto";
import { PostImageUploadInterceptor } from "./interceptors/post-image-upload.interceptor";
import { LoggedInGuard } from "../auth/guard/authorization/logged-in.guard";

@ApiTags("UPLOAD")
@Controller("api/upload")
export class UploadController {
  @ApiOperation({
    summary: "게시글의 이미지 업로드",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: PostImageUploadRequestDto })
  @ApiCreatedResponse({
    description: "이미지 업로드 성공",
    type: PostImageUploadResultDto,
  })
  @UseInterceptors(PostImageUploadInterceptor)
  @UseGuards(LoggedInGuard)
  @Post("/posts")
  saveFile(@UploadedFile() file: Express.MulterS3.File) {
    console.log(file);
    return new PostImageUploadResultDto(file.location);
  }
}
