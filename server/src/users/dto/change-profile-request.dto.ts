import {
  ApiHideProperty,
  ApiProperty,
  PartialType,
  PickType,
} from "@nestjs/swagger";
import { User } from "../../models/user.model";
import { IsOptional } from "class-validator";
import { Exclude } from "class-transformer";
import { BooleanTransform } from "../../common/decorator/boolean-transform.decorator";
import { StringToStringArrayTransform } from "../../common/decorator/string-to-string-array-transform.decorator";

const keys = [
  "blogUrl",
  "githubUrl",
  "portfolioUrl",
  "isBlogUrlPublic",
  "isGithubUrlPublic",
  "isPortfolioUrlPublic",
  "techStack",
  "interestTech",
] as const;

export class ChangeProfileRequestDto extends PartialType<
  Pick<User, typeof keys[number]>
>(PickType(User, keys)) {
  @BooleanTransform()
  @IsOptional()
  isBlogUrlPublic?: boolean;

  @BooleanTransform()
  @IsOptional()
  isGithubUrlPublic?: boolean;

  @BooleanTransform()
  @IsOptional()
  isPortfolioUrlPublic?: boolean;

  @IsOptional()
  @StringToStringArrayTransform({ defaultValue: [] })
  techStack?: string[] = [];

  @IsOptional()
  @StringToStringArrayTransform({ defaultValue: [] })
  interestTech?: string[] = [];

  @ApiProperty({
    type: String,
    format: "binary",
  })
  avatar?: any;

  @Exclude()
  @ApiHideProperty()
  avatarUrl?: string;
}
