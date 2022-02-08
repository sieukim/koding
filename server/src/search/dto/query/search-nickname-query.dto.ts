import { CursorPagingQueryDto } from "../../../common/dto/query/cursor-paging-query.dto";
import { IsString, MaxLength, MinLength } from "class-validator";

export class SearchNicknameQueryDto extends CursorPagingQueryDto {
  /*
   * 검색할 닉네임
   */
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  nickname: string;
}
