import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { PostBoardType } from "../models/post.model";
import { BoardTypeValidationPipe } from "../common/pipes/board-type-validation-pipe";
import {
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { ApiParamBoardType } from "../common/decorator/swagger/api-param.decorator";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { GetCertifiedTagsQuery } from "./queries/get-certified-tags.query";
import { GetCertifiedTagsHandler } from "./queries/handlers/get-certified-tags.handler";
import { AddCertifiedTagsRequestDto } from "./dto/add-certified-tags-request.dto";
import { AddCertifiedTagsCommand } from "./commands/add-certified-tags.command";
import { RemoveCertifiedTagsCommand } from "./commands/remove-certified-tags.command";

@ApiTags("CERTIFIED_TAG")
@Controller("api/tags")
export class TagsController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @ApiOperation({
    summary: "게시판의 인증된 태그 조회",
  })
  @ApiParamBoardType({ description: "태그를 조회할 게시판" })
  @HttpCode(HttpStatus.OK)
  @Get(":boardType")
  getCertifiedTagsForBoard(
    @Param("boardType", BoardTypeValidationPipe) boardType: PostBoardType,
  ) {
    return this.queryBus.execute(
      new GetCertifiedTagsQuery(boardType),
    ) as ReturnType<GetCertifiedTagsHandler["execute"]>;
  }

  @ApiOperation({
    summary: "게시판에 인증된 태그 추가. 관리자 전용",
    description: "관리자 전용",
  })
  @ApiParamBoardType({ description: "태그를 추가할 게시판" })
  @ApiBody({ type: AddCertifiedTagsRequestDto })
  @ApiForbiddenResponse({
    description: "권한 없음",
  })
  @ApiCreatedResponse({
    description: "인증된 태그 추가 성공",
    type: [String],
  })
  @HttpCode(HttpStatus.CREATED)
  @Post(":boardType")
  addCertifiedTags(
    @Param("boardType", BoardTypeValidationPipe) boardType: PostBoardType,
    @Body() body: AddCertifiedTagsRequestDto,
  ) {
    const { tags } = body;
    return this.commandBus.execute(
      new AddCertifiedTagsCommand(boardType, tags),
    );
  }

  @ApiOperation({
    summary: "게시판에 인증된 태그를 삭제. 관리자 전용",
    description: "관리자 전용",
  })
  @ApiQuery({
    name: "tags",
    type: String,
    description:
      "삭제할 태그. 여러개인 경우 , 로 구분. 지정하지 않을 경우 해당 게시판의 모든 인증된 태그 삭제",
    required: false,
    examples: {
      "삭제할 태그가 하나인 경우": { value: "tag1" },
      "삭제할 태그가 여러개인 경우": { value: "tag1,tag2" },
    },
  })
  @ApiParamBoardType({ description: "태그를 삭제할 게시판" })
  @ApiForbiddenResponse({
    description: "권한 없음",
  })
  @ApiNoContentResponse({
    description: "인증된 태그 삭제 성공",
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":boardType")
  async removeCertifiedTags(
    @Param("boardType", BoardTypeValidationPipe) boardType: PostBoardType,
    @Query("tags") tags?: string[],
  ) {
    await this.commandBus.execute(
      new RemoveCertifiedTagsCommand(boardType, tags === undefined, tags),
    );
  }
}
