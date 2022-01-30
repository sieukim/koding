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
import {
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { GetAllTagsQuery } from "./queries/get-all-tags.query";
import { GetAllTagsHandler } from "./queries/handlers/get-all-tags.handler";
import { AddCertifiedTagsRequestDto } from "./dto/add-certified-tags-request.dto";
import { AddCertifiedTagsCommand } from "./commands/add-certified-tags.command";
import { RemoveCertifiedTagsCommand } from "./commands/remove-certified-tags.command";
import { BoardTypeParamDto } from "../posts/dto/param/board-type-param.dto";

// TODO: 권한 가드 추가
@ApiTags("TAG")
@Controller("api/tags")
export class TagsController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @ApiOperation({
    summary: "게시판의 모든 태그 조회",
  })
  @HttpCode(HttpStatus.OK)
  @Get(":boardType")
  getCertifiedTagsForBoard(@Param() { boardType }: BoardTypeParamDto) {
    return this.queryBus.execute(new GetAllTagsQuery(boardType)) as ReturnType<
      GetAllTagsHandler["execute"]
    >;
  }

  @ApiOperation({
    summary: "게시판에 인증된 태그 추가. 관리자 전용",
    description: "관리자 전용",
  })
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
    @Param() { boardType }: BoardTypeParamDto,
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
  @ApiForbiddenResponse({
    description: "권한 없음",
  })
  @ApiNoContentResponse({
    description: "인증된 태그 삭제 성공",
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":boardType")
  async removeCertifiedTags(
    @Param() { boardType }: BoardTypeParamDto,
    @Query("tags") tags?: string[],
  ) {
    await this.commandBus.execute(
      new RemoveCertifiedTagsCommand(boardType, tags === undefined, tags),
    );
  }
}
