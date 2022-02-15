import { OmitType } from "@nestjs/swagger";
import { SearchPostQueryDto } from "./search-post-query.dto";

export class UnifiedSearchPostQueryDto extends OmitType(SearchPostQueryDto, [
  "cursor",
  "pageSize",
] as const) {}
