import { IsString, MinLength } from "class-validator";
import { CursorPagingQueryDto } from "../../../common/dto/query/cursor-paging-query.dto";

export class SearchPostQueryDto extends CursorPagingQueryDto {
  @IsString()
  @MinLength(0)
  query: string;
}
