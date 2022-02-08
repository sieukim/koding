import { IntersectionType } from "@nestjs/swagger";
import { CommentIdentifierParamDto } from "./comment-identifier-param.dto";
import { NicknameParamDto } from "../../../users/dto/param/nickname-param.dto";

export class CommentIdentifierWithNicknameParamDto extends IntersectionType(
  CommentIdentifierParamDto,
  NicknameParamDto,
) {}
