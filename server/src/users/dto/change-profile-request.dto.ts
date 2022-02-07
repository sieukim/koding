import {
  ApiHideProperty,
  ApiProperty,
  PartialType,
  PickType,
} from "@nestjs/swagger";
import { User } from "../../models/user.model";
import { IsBoolean, IsOptional } from "class-validator";
import { Exclude } from "class-transformer";

const keys = [
  "blogUrl",
  "githubUrl",
  "portfolioUrl",
  "isBlogUrlPublic",
  "isGithubUrlPublic",
  "isPortfolioUrlPublic",
] as const;

export class ChangeProfileRequestDto extends PartialType<
  Pick<User, typeof keys[number]>
>(PickType(User, keys)) {
  @IsOptional()
  @IsBoolean()
  isBlogUrlPublic?: boolean;

  @IsOptional()
  @IsBoolean()
  isGithubUrlPublic?: boolean;

  @IsOptional()
  @IsBoolean()
  isPortfolioUrlPublic?: boolean;

  @ApiProperty({
    type: String,
    format: "binary",
  })
  avatar?: any;

  @Exclude()
  @ApiHideProperty()
  avatarUrl?: string;
}
