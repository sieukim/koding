import { Type } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional, PickType } from "@nestjs/swagger";
import { User } from "../../entities/user.entity";

export class NicknameAndAvatar extends PickType(User, [
  "nickname",
  "avatarUrl",
] as const) {
  constructor(nickname: string, avatarUrl: string | null) {
    super();
    this.nickname = nickname;
    this.avatarUrl = avatarUrl;
  }
}

export class NicknameSearchResultDto {
  /*
   * 총 검색 개수
   */
  totalCount: number;

  /*
   * 검색 결과
   */
  @Type(() => NicknameAndAvatar)
  users: NicknameAndAvatar[];

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description:
      "다음 페이지를 가져오기 위한 커서 query 값. 마지막 페이지인 경우는 값 없음",
  })
  nextPageCursor?: string;

  constructor(
    users: Readonly<NicknameAndAvatar>[],
    totalCount: number,
    nextPageCursor?: string,
  ) {
    this.users = users;
    this.totalCount = totalCount;
    this.nextPageCursor = nextPageCursor;
  }
}
