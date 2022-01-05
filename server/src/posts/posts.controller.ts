import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { WritePostRequestDto } from "./dto/write-post-request.dto";
import { PostsService } from "./posts.service";
import { ReadPostDto } from "./dto/read-post.dto";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags
} from "@nestjs/swagger";
import { ApiForbiddenVerifiedUserResponse } from "../common/decorator/swagger/api-response.decorator";
import { VerifiedUserGuard } from "../auth/guard/authorization/verified-user.guard";
import { LoginUser } from "../common/decorator/login-user.decorator";
import { User } from "../schemas/user.schema";
import { ModifyPostRequestDto } from "./dto/modify-post-request.dto";
import { ReadPostWithWriterDto } from "./dto/read-post-with-writer.dto";
import { BoardTypeValidationPipe } from "../common/pipes/board-type-validation-pipe";
import { ApiParamBoardType } from "../common/decorator/swagger/api-param.decorator";
import { PostBoardType } from "../schemas/post.schema";

@ApiTags("POST")
@ApiBadRequestResponse({
  description: "param, query, body 중 유효하지 않은 요청값이 존재"
})
@Controller("api/posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {
  }

  @ApiOperation({
    summary: "게시글 쓰기"
  })
  @ApiParamBoardType
  @ApiBody({
    type: WritePostRequestDto
  })
  @ApiCreatedResponse({
    description: "게시글 쓰기 성공",
    type: ReadPostDto
  })
  @ApiForbiddenVerifiedUserResponse
  @UseGuards(VerifiedUserGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post(":boardType")
  async writePost(@LoginUser() user: User, @Param("boardType", BoardTypeValidationPipe) boardType: PostBoardType, @Body() body: WritePostRequestDto) {
    const post = await this.postsService.writePost(boardType, user, body);
    return new ReadPostDto(post);
  }

  @ApiOperation({
    summary: "게시글 목록 조회"
  })
  @ApiParamBoardType
  @ApiOkResponse({
    description: "게시글 목록 조회 성공",
    type: [ReadPostDto]
  })
  @Get(":boardType")
  async readPosts(@Param("boardType", BoardTypeValidationPipe) boardType: PostBoardType) {
    const posts = await this.postsService.getPosts(boardType);
    return posts.map(post => new ReadPostDto(post));
  }

  @ApiOperation({
    summary: "게시글 읽기"
  })
  @ApiParam({
    name: "postId",
    description: "읽을 게시글 아이디"
  })
  @ApiParamBoardType
  @ApiNotFoundResponse({
    description: "잘못된 게시글 아이디"
  })
  @ApiOkResponse({
    description: "게시글 읽기 성공",
    type: ReadPostWithWriterDto
  })
  @ApiParamBoardType
  @HttpCode(HttpStatus.OK)
  @Get(":boardType/:postId")
  async readPost(@Param("boardType", BoardTypeValidationPipe) boardType: PostBoardType, @Param("postId") postId: string) {
    const post = await this.postsService.readPost(boardType, postId);
    console.log(post);
    return new ReadPostWithWriterDto(post, post.writer as User);
  }

  @ApiOperation({
    summary: "게시글 수정"
  })
  @ApiBody({
    type: ModifyPostRequestDto
  })
  @ApiParam({
    name: "postId",
    description: "수정할 게시글의 아이디"
  })
  @ApiForbiddenResponse({
    description: "권한 없음"
  })
  @ApiOkResponse({
    description: "게시글 수정 성공",
    type: ReadPostDto
  })
  @UseGuards(VerifiedUserGuard)
  @HttpCode(HttpStatus.OK)
  @Patch(":boardType/:postId")
  async modifyPost(@Param("boardType", BoardTypeValidationPipe) boardType: PostBoardType, @Param("postId") postId: string, @Body() body: ModifyPostRequestDto, @LoginUser() user: User) {
    const post = await this.postsService.modifyPost(user, boardType, postId, body);
    return new ReadPostDto(post);
  }

  @ApiOperation({
    summary: "게시글 삭제"
  })
  @ApiParam({
    name: "postId",
    description: "삭제할 게시글의 아이디"
  })
  @ApiParamBoardType
  @ApiForbiddenResponse({
    description: "권한 없음"
  })
  @ApiNoContentResponse({
    description: "게시글 식제 성공"
  })
  @UseGuards(VerifiedUserGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":boardType/:postId")
  async deletePost(@Param("boardType", BoardTypeValidationPipe) boardType: PostBoardType, @Param("postId") postId: string, @LoginUser() user: User) {
    await this.postsService.deletePost(user, boardType, postId);
  }
}
