import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Transform, Type } from "class-transformer";
import { CursorPagingQueryDto } from "../../../common/dto/query/cursor-paging-query.dto";

export class ReadPostQueryDto extends CursorPagingQueryDto {
  @IsOptional()
  @IsArray()
  @Type(() => String)
  @Transform(({ value }) => (value as string).split(",").map((v) => v.trim()))
  tags?: string[];

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  writer?: string;
}
