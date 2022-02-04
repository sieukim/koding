import { IntersectionType } from "@nestjs/swagger";
import { CursorQueryDto } from "./cursor-query.dto";
import { PageSizeQueryDto } from "./page-size-query.dto";

export class CursorPagingQueryDto extends IntersectionType(
  CursorQueryDto,
  PageSizeQueryDto,
) {}
