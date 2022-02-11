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
import { VerifiedUserGuard } from "../auth/guard/authorization/verified-user.guard";
import { PostImageUploadResultDto } from "./dto/post-image-upload-result.dto";
import { PostImageUploadRequestDto } from "./dto/post-image-upload-request.dto";
import { PostImageUploadInterceptor } from "./interceptors/post-image-upload.interceptor";

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
  @UseGuards(VerifiedUserGuard)
  @Post("/posts")
  saveFile(@UploadedFile() file: Express.MulterS3.File) {
    console.log(file);
    return new PostImageUploadResultDto(file.location);
  }
}
