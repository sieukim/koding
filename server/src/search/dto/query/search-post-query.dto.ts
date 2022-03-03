import {
  ArrayMaxSize,
  ArrayMinSize,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  isString,
  IsString,
} from "class-validator";
import { CursorPagingQueryDto } from "../../../common/dto/query/cursor-paging-query.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { PostSortType } from "../../services/post-search.service";

export class SearchPostQueryDto extends CursorPagingQueryDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional({
    description: "검색할 검색어. 태그와 중복 입력 가능",
    type: String,
  })
  query?: string;

  @IsOptional()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @Transform(({ value }) => (isString(value) ? value.split(",") : value))
  @ApiPropertyOptional({
    description: "검색할 태그들. 검색어와 중복 입력 가능",
    type: String,
  })
  tags?: string[];

  @IsOptional()
  @IsEnum(PostSortType)
  @ApiPropertyOptional({
    description: "정렬 타입",
    enum: PostSortType,
    default: PostSortType.Associativity,
  })
  sort: PostSortType = PostSortType.Associativity;
}
