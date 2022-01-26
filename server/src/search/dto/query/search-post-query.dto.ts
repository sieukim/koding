import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class SearchPostQueryDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  cursor?: string;

  @IsString()
  @MinLength(0)
  query: string;
}
