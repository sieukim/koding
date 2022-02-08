import { IsString, MinLength } from "class-validator";
import { CursorPagingQueryDto } from "../../../common/dto/query/cursor-paging-query.dto";

export class SearchPostQueryDto extends CursorPagingQueryDto {
  /*
   * 검색할 검색어
   */
  @IsString()
  @MinLength(1)
  query: string;
}
