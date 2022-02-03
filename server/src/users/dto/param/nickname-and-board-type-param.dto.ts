import { IntersectionType } from "@nestjs/swagger";
import { NicknameParamDto } from "./nickname-param.dto";
import { BoardTypeParamDto } from "../../../posts/dto/param/board-type-param.dto";

export class NicknameAndBoardTypeParamDto extends IntersectionType(
  NicknameParamDto,
  BoardTypeParamDto,
) {}
