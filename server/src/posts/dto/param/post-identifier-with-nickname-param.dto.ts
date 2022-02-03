import { IntersectionType } from "@nestjs/swagger";
import { PostIdentifierParamDto } from "./post-identifier-param.dto";
import { NicknameParamDto } from "../../../users/dto/param/nickname-param.dto";

export class PostIdentifierWithNicknameParamDto extends IntersectionType(
  PostIdentifierParamDto,
  NicknameParamDto,
) {}
