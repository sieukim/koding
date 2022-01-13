import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Transform, Type } from "class-transformer";

export class ReadPostFilter {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  cursor?: string;

  @IsArray()
  @IsOptional()
  @Type(() => String)
  @Transform(({ value }) => (value as string).split(",").map((v) => v.trim()))
  tags?: string[];
}
